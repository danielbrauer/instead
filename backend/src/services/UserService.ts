import { Service } from 'typedi'
import DatabaseService from './DatabaseService'
import * as Users from '../queries/users.gen'
import * as Followers from '../queries/followers.gen'
import * as FollowRequests from '../queries/follow_requests.gen'
import unambiguousString from '../util/unambiguousString'
import { SimpleEventDispatcher } from 'strongly-typed-events'
import { FollowRelationship } from '../types/api'
import { ServerError } from '../middleware/errors'
import { NewUser } from 'auth'

@Service()
export default class UserService {
    private _onUserCreated = new SimpleEventDispatcher<number>()
    private _onUserAddedFollower = new SimpleEventDispatcher<FollowRelationship>()
    private _onUserLostFollower = new SimpleEventDispatcher<FollowRelationship>()

    constructor(private db: DatabaseService) {}

    public get onUserCreated() {
        return this._onUserCreated.asEvent()
    }
    public get onUserAddedFollower() {
        return this._onUserAddedFollower.asEvent()
    }
    public get onUserLostFollower() {
        return this._onUserLostFollower.asEvent()
    }

    async getUserById(userId: number) {
        const [user] = await Users.getById.run({ userId }, this.db.pool)
        if (!user) throw new ServerError('User does not exist')
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
        const [{ count }] = await Users.countByName.run({ username }, this.db.pool)
        return count
    }

    async create(newUser: NewUser) {
        const [user] = await Users.create.run(newUser, this.db.pool)
        this._onUserCreated.dispatchAsync(user.id)
        return user
    }

    async addFollowRequestByCode(requesterId: number, friendCode: string) {
        const [requestee] = await Users.getByFriendCode.run({ friendCode }, this.db.pool)
        if (!requestee) throw new ServerError('User does not exist')
        await this.addFollowRequest(requesterId, requestee.id, friendCode)
    }

    async addFollowRequestById(requesterId: number, requesteeId: number) {
        const [{ count: followCount }] = await Followers.count.run(
            { followerId: requesteeId, followeeId: requesterId },
            this.db.pool,
        )
        if (followCount === 0) throw new ServerError('Requestee does not follow you')
        await this.addFollowRequest(requesterId, requesteeId)
    }

    async addFollowRequest(requesterId: number, requesteeId: number, friendCode?: string) {
        await this.db.transaction(async (client) => {
            if (requesteeId === requesterId)
                throw new ServerError("You don't need to follow yourself")
            const [{ count: followCount }] = await Followers.count.run(
                { followerId: requesterId, followeeId: requesteeId },
                client,
            )
            if (followCount !== 0) throw new ServerError('Already following user')
            const [{ count: requestCount }] = await FollowRequests.count.run(
                { requesterId, requesteeId },
                client,
            )
            if (requestCount !== 0) throw new ServerError('Request already exists')
            await FollowRequests.create.run({ requesterId, requesteeId, friendCode }, client)
        })
    }

    async acceptFollowRequest(requesterId: number, requesteeId: number) {
        await this.db.transaction(async (client) => {
            const [request] = await FollowRequests.destroyAndReturn.run(
                { requesterId, requesteeId },
                client,
            )
            if (!request) throw new ServerError('No such follow request')
            await Followers.create.run(
                { followerId: request.requesterId, followeeId: request.requesteeId },
                client,
            )
        })
        this._onUserAddedFollower.dispatchAsync({
            followerId: requesterId,
            followeeId: requesteeId,
        })
    }

    async removeFollowRequest(requesterId: number, requesteeId: number) {
        await FollowRequests.destroy.run({ requesterId, requesteeId }, this.db.pool)
    }

    async getFollowRequests(requesteeId: number) {
        const requests = await FollowRequests.getByRequesteeId.run({ requesteeId }, this.db.pool)
        return requests.map((r) => r.requesterId)
    }

    async getSentFollowRequests(requesterId: number) {
        const requests = await FollowRequests.getByRequesterId.run({ requesterId }, this.db.pool)
        return requests
    }

    async getFollowers(followeeId: number) {
        const follows = await Followers.getByFolloweeId.run({ followeeId }, this.db.pool)
        return follows.map((r) => r.followerId)
    }

    async getFollowees(followerId: number) {
        const follows = await Followers.getByFollowerId.run({ followerId }, this.db.pool)
        return follows.map((r) => r.followeeId)
    }

    async removeFollower(followerId: number, followeeId: number) {
        const [removed] = await Followers.destroy.run({ followerId, followeeId }, this.db.pool)
        if (removed) this._onUserLostFollower.dispatchAsync({ followerId, followeeId })
    }

    async regenerateFriendCode(userId: number) {
        const codeLength = Math.floor(Math.log2(userId) / 5.0) + 3 //three digits plus 1 for every power of 32
        let code = ''
        for (let i = 0; i < 5; ++i) {
            code = await unambiguousString(codeLength)
            try {
                await Users.setFriendCode.run({ friendCode: code, userId }, this.db.pool)
                return code
            } catch (error) {
                console.log(error)
            }
        }
        throw new ServerError('Too many hits. Please try again.')
    }
}
