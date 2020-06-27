import { Service, Inject } from "typedi"
import Database from '../services/database'
import * as Users from '../queries/users.gen'
import * as Followers from '../queries/followers.gen'
import * as FollowRequests from '../queries/follow_requests.gen'

@Service()
export default class UserService {

    @Inject()
    db: Database

    async getUserById(userId: number) {
        const [user] = await Users.getById.run({ userId }, this.db.pool)
        if (!user)
            throw new Error('User does not exist')
        return user
    }

    async addFollowRequest(requesterId: number, requesteeName: string) {
        const error = await this.db.transaction(async(db) => {
            const [requestee] = await Users.getByName.run({ username: requesteeName }, db)
            if (!requestee)
                throw new Error('User does not exist')
            if (requestee.id === requesterId)
                throw new Error('You don\'t need to follow yourself')
            const [{count: followCount}] = await Followers.count.run(
                { followerId: requesterId, followeeId: requestee.id },
                db
            )
            if (!this.db.isCountZero(followCount))
                throw new Error('Already following user')
            const [{count: requestCount}] = await FollowRequests.count.run(
                { requesterId: requesterId, requesteeId: requestee.id },
                db
            )
            if (!this.db.isCountZero(requestCount))
                throw new Error('Request already exists')
            await FollowRequests.create.run({ requesterId, requesteeId: requestee.id }, db)
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
    }
}

