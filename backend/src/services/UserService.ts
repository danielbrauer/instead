import { SimpleEventDispatcher } from 'strongly-typed-events'
import { Service } from 'typedi'
import { ServerError } from '../middleware/errors'
import * as FollowRelationships from '../queries/follow_relationships.gen'
import * as FollowRequests from '../queries/follow_requests.gen'
import * as Users from '../queries/users.gen'
import { FollowRelationship } from '../types/api'
import unambiguousString from '../util/unambiguousString'
import AuthService from './AuthService'
import DatabaseService from './DatabaseService'

@Service()
export default class UserService {
    private _onUserAddedFollower = new SimpleEventDispatcher<FollowRelationship>()
    private _onUserLostFollower = new SimpleEventDispatcher<FollowRelationship>()

    constructor(private db: DatabaseService, auth: AuthService) {
        auth.onUserCreated.subscribe((x) => this.regenerateFriendCode(x))
    }

    public get onUserAddedFollower() {
        return this._onUserAddedFollower.asEvent()
    }
    public get onUserLostFollower() {
        return this._onUserLostFollower.asEvent()
    }

    async getUserProfileWithKey(userId: number, requesterId: number) {
        const [user] = await Users.getProfileWithKey.run({ userId, requesterId }, this.db.pool)
        return user || null
    }

    async setProfile(userId: number, displayName: string, displayNameIv: string) {
        await Users.setProfileData.run({ userId, displayName, displayNameIv }, this.db.pool)
    }

    async addFollowRequestByCode(requesterId: number, friendCode: string) {
        const [requestee] = await Users.getByFriendCode.run({ friendCode }, this.db.pool)
        if (!requestee) throw new ServerError('User does not exist')
        await this.addFollowRequest(requesterId, requestee.id, friendCode)
        return requestee.id
    }

    async addFollowRequestById(requesterId: number, requesteeId: number) {
        const [{ count: followCount }] = await FollowRelationships.count.run(
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
            const [{ count: followCount }] = await FollowRelationships.count.run(
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
            const [request] = await FollowRequests.getByIds.run(
                { requesterId, requesteeId },
                client,
            )
            if (!request) throw new ServerError('No such follow request')
            await FollowRequests.acceptFollowRequest.run({ requestId: request.id }, client)
        })
        this._onUserAddedFollower.dispatchAsync({
            followerId: requesterId,
            followeeId: requesteeId,
        })
    }

    async removeFollowRequest(requesterId: number, requesteeId: number) {
        await FollowRequests.destroy.run({ requesterId, requesteeId }, this.db.pool)
    }

    async getFollowRequestCount(requesteeId: number) {
        const [{count}] = await FollowRequests.countByRequesteeId.run({ requesteeId }, this.db.pool)
        return count
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
        const follows = await FollowRelationships.getByFolloweeId.run({ followeeId }, this.db.pool)
        return follows.map((r) => r.followerId)
    }

    async getFollowees(followerId: number) {
        const follows = await FollowRelationships.getByFollowerId.run({ followerId }, this.db.pool)
        return follows.map((r) => r.followeeId)
    }

    async removeFollower(followerId: number, followeeId: number) {
        const [removed] = await FollowRelationships.destroy.run(
            { followerId, followeeId },
            this.db.pool,
        )
        if (removed) this._onUserLostFollower.dispatchAsync({ followerId, followeeId })
    }

    async getFriendCode(userId: number) {
        const [{ friendCode }] = await Users.getFriendCode.run({ userId }, this.db.pool)
        return friendCode || null
    }

    async regenerateFriendCode(userId: number) {
        const codeLength = Math.floor(Math.log2(userId) / 5.0) + 3 //three digits plus 1 for every power of 32
        for (let i = 0; i < 5; ++i) {
            const code = await unambiguousString(codeLength)
            try {
                await Users.setFriendCode.run({ friendCode: code, userId }, this.db.pool)
                return code
            } catch (error) {
                console.log(error)
            }
        }
        throw new ServerError('Too many hits. Please try again.')
    }

    async setActivityLastCheckedDate(userId: number) {
        return await Users.setActivityLastCheckedDate.run({ userId }, this.db.pool)
    }
}
