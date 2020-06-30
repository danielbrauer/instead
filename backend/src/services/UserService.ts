import { Service, Inject } from "typedi"
import Database from './DatabaseService'
import * as Users from '../queries/users.gen'
import * as Followers from '../queries/followers.gen'
import * as FollowRequests from '../queries/follow_requests.gen'
import { EventDispatcher } from 'event-dispatch'
import Events from '../types/events'

@Service()
export default class UserService {

    @Inject()
    private db: Database

    private dispatcher: EventDispatcher

    constructor() {
        this.dispatcher = new EventDispatcher()
    }

    async getUserById(userId: number) {
        const [user] = await Users.getById.run({ userId }, this.db.pool)
        if (!user)
            throw new Error('User does not exist')
        return user
    }

    async getLoginInfo(username: string) {
        const [loginInfo] = await Users.getLoginInfoByName.run({ username }, this.db.pool)
        return loginInfo
    }

    async countByName(username: string) {
        const [{count}] = await Users.countByName.run({ username }, this.db.pool)
        return count
    }

    async create(
        username: string,
        display_name: string,
        verifier: string,
        srp_salt: string,
        muk_salt: string,
        public_key: string,
        private_key: string,
        private_key_iv: string
    ) {
        const [user] = await Users.create.run(
            {
                username,
                display_name,
                verifier,
                srp_salt,
                muk_salt,
                public_key,
                private_key,
                private_key_iv
            },
            this.db.pool
        )
        this.dispatcher.dispatch(Events.user.created, user.id)
        return user
    }

    async addFollowRequest(requesterId: number, requesteeName: string) {
        const error = await this.db.transaction(async(client) => {
            const [requestee] = await Users.getByName.run({ username: requesteeName }, client)
            if (!requestee)
                throw new Error('User does not exist')
            if (requestee.id === requesterId)
                throw new Error('You don\'t need to follow yourself')
            const [{count: followCount}] = await Followers.count.run(
                { followerId: requesterId, followeeId: requestee.id },
                client
            )
            if (followCount !== 0)
                throw new Error('Already following user')
            const [{count: requestCount}] = await FollowRequests.count.run(
                { requesterId: requesterId, requesteeId: requestee.id },
                client
            )
            if (requestCount !== 0)
                throw new Error('Request already exists')
            await FollowRequests.create.run({ requesterId, requesteeId: requestee.id }, client)
        })
    }

    async acceptFollowRequest(requesterId: number, requesteeId: number) {
        await this.db.transaction(async(client) => {
            const [request] = await FollowRequests.destroyAndReturn.run({ requesterId, requesteeId}, client)
            if (!request)
                throw new Error('No such follow request')
            await Followers.create.run(
                { followerId: request.requester_id, followeeId: request.requestee_id},
                client
            )
        })
        this.dispatcher.dispatch(Events.user.addedFollower, { followerId: requesterId, followeeId: requesteeId })
    }

    async removeFollowRequest(requesterId: number, requesteeId: number) {
        await FollowRequests.destroy.run({ requesterId, requesteeId }, this.db.pool)
    }

    async getFollowRequests(requesteeId: number) {
        return await FollowRequests.getByRequesteeId.run({ requesteeId }, this.db.pool)
    }

    async getFollowers(followeeId: number) {
        const follows = await Followers.getByFolloweeId.run({ followeeId }, this.db.pool)
        return follows.map(r => r.follower_id)
    }

    async getFollowees(followerId: number) {
        const follows = await Followers.getByFollowerId.run({ followerId }, this.db.pool)
        return follows.map(r => r.followee_id)
    }

    async removeFollower(followerId: number, followeeId: number) {
        await Followers.destroy.run({ followerId, followeeId }, this.db.pool)
        this.dispatcher.dispatch(Events.user.lostFollower, { followerId, followeeId })
    }
}

