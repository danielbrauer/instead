import { Service } from 'typedi'
import Database from './DatabaseService'
import * as Users from '../queries/users.gen'
import * as Followers from '../queries/followers.gen'
import * as FollowRequests from '../queries/follow_requests.gen'
import { SimpleEventDispatcher } from 'strongly-typed-events'
import { FollowRelationship } from '../types/api'
import { ServerError } from '../middleware/errors'
import { NewUser } from 'auth'

@Service()
export default class UserService {

    private _onUserCreated = new SimpleEventDispatcher<number>()
    private _onUserAddedFollower = new SimpleEventDispatcher<FollowRelationship>()
    private _onUserLostFollower = new SimpleEventDispatcher<FollowRelationship>()

    constructor(private db: Database) {}

    public get onUserCreated() { return this._onUserCreated.asEvent() }
    public get onUserAddedFollower() { return this._onUserAddedFollower.asEvent() }
    public get onUserLostFollower() { return this._onUserLostFollower.asEvent() }

    async getUserById(userId: number) {
        const [user] = await Users.getById.run({ userId }, this.db.pool)
        if (!user)
            throw new ServerError('User does not exist')
        return user
    }

    async getLoginInfo(username: string) {
        const [loginInfo] = await Users.getLoginInfoByName.run({ username }, this.db.pool)
        return loginInfo || null
    }

    async getUserInfo(userId: number) {
        const [info] = await Users.getUserInfo.run({ userId }, this.db.pool)
        return info || null
    }

    async countByName(username: string) {
        const [{count}] = await Users.countByName.run({ username }, this.db.pool)
        return count
    }

    async create(newUser: NewUser) {
        const [user] = await Users.create.run(newUser, this.db.pool)
        this._onUserCreated.dispatchAsync(user.id)
        return user
    }

    async addFollowRequest(requesterId: number, requesteeName: string) {
        await this.db.transaction(async(client) => {
            const [requestee] = await Users.getByName.run({ username: requesteeName }, client)
            if (!requestee)
                throw new ServerError('User does not exist')
            if (requestee.id === requesterId)
                throw new ServerError('You don\'t need to follow yourself')
            const [{count: followCount}] = await Followers.count.run(
                { followerId: requesterId, followeeId: requestee.id },
                client
            )
            if (followCount !== 0)
                throw new ServerError('Already following user')
            const [{count: requestCount}] = await FollowRequests.count.run(
                { requesterId: requesterId, requesteeId: requestee.id },
                client
            )
            if (requestCount !== 0)
                throw new ServerError('Request already exists')
            await FollowRequests.create.run({ requesterId, requesteeId: requestee.id }, client)
        })
    }

    async acceptFollowRequest(requesterId: number, requesteeId: number) {
        await this.db.transaction(async(client) => {
            const [request] = await FollowRequests.destroyAndReturn.run({ requesterId, requesteeId}, client)
            if (!request)
                throw new ServerError('No such follow request')
            await Followers.create.run(
                { followerId: request.requesterId, followeeId: request.requesteeId},
                client
            )
        })
        this._onUserAddedFollower.dispatchAsync({ followerId: requesterId, followeeId: requesteeId })
    }

    async removeFollowRequest(requesterId: number, requesteeId: number) {
        await FollowRequests.destroy.run({ requesterId, requesteeId }, this.db.pool)
    }

    async getFollowRequests(requesteeId: number) {
        const requests = await FollowRequests.getByRequesteeId.run({ requesteeId }, this.db.pool)
        return requests.map(r => r.requesterId)
    }

    async getFollowers(followeeId: number) {
        const follows = await Followers.getByFolloweeId.run({ followeeId }, this.db.pool)
        return follows.map(r => r.followerId)
    }

    async getFollowees(followerId: number) {
        const follows = await Followers.getByFollowerId.run({ followerId }, this.db.pool)
        return follows.map(r => r.followeeId)
    }

    async removeFollower(followerId: number, followeeId: number) {
        const [removed] = await Followers.destroy.run({ followerId, followeeId }, this.db.pool)
        if (removed)
            this._onUserLostFollower.dispatchAsync({ followerId, followeeId })
    }
}

