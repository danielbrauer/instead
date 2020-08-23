import { Service } from 'typedi'
import DatabaseService from './DatabaseService'
import * as Keys from '../queries/keys.gen'
import * as FollowRelationships from '../queries/follow_relationships.gen'
import UserService from './UserService'
import { FollowRelationship, EncryptedPostKey } from '../types/api'
import { ServerError } from '../middleware/errors'

@Service()
export default class KeyService {
    constructor(private userService: UserService, private db: DatabaseService) {
        this.userService.onUserLostFollower.subscribe((x) => this.onFollowerLost(x))
    }

    private async onFollowerLost(followRelationship: FollowRelationship) {
        await this.invalidateCurrentKeySets(followRelationship.followeeId)
    }

    async getCurrentPostKey(userId: number) {
        const [key] = await Keys.getCurrentPostKey.run({ userId }, this.db.pool)
        return key || null
    }

    async getKey(userId: number, keySetId: number) {
        const [key] = await Keys.getKey.run({ userId, keySetId }, this.db.pool)
        return key || null
    }

    async getAllPostKeys(userId: number) {
        return await Keys.getAllPostKeys.run({ userId }, this.db.pool)
    }

    async getFollowerPublicKeys(userId: number) {
        const publicKeys = await Keys.getFollowerPublicKeys.run({ userId }, this.db.pool)
        return publicKeys
    }

    async getPublicKey(userId: number) {
        const [publicKey] = await Keys.getPublicKey.run({ userId }, this.db.pool)
        return publicKey || null
    }

    async invalidateCurrentKeySets(userId: number) {
        await Keys.endPostKeySetValidity.run({ userId }, this.db.pool)
    }

    async createCurrentPostKeySet(userId: number, key: string) {
        const [{ keySetId }] = await Keys.createCurrentPostKeySet.run(
            { ownerId: userId, key },
            this.db.pool,
        )
        return keySetId
    }

    async addNewPostKeyForFollowers(followeeId: number, keys: EncryptedPostKey[]) {
        await this.db.transaction(async (client) => {
            const followRelationships = await FollowRelationships.getByFolloweeId.run(
                { followeeId },
                client,
            )
            if (followRelationships.length != keys.length) {
                throw new ServerError(
                    `Expecting post keys for ${followRelationships.length} followers, but got ${keys.length}`,
                )
            }
            const keysWithFollowerIds = keys.map((key) => {
                const followRelationship = followRelationships.find(
                    (x) => x.followerId == key.userId,
                )
                if (followRelationship === undefined)
                    throw new ServerError(
                        `Cannot save post key for non-follower, id: ${key.userId}`,
                    )
                return {
                    followRelationshipId: followRelationship.id,
                    ...key,
                }
            })
            await Keys.addPostKeys.run({ keysWithFollowerIds }, this.db.pool)
        })
    }

    async addOldPostKeysForFollower(followeeId: number, keys: EncryptedPostKey[]) {
        await this.db.transaction(async (client) => {
            const [followRelationship] = await FollowRelationships.getExact.run(
                { followeeId, followerId: keys[0].userId },
                client,
            )
            if (followRelationship === undefined) {
                throw new ServerError(
                    `Cannot save post key for non-follower, id: ${keys[0].userId}`,
                )
            }
            const keysWithFollowerIds = keys.map((key) => {
                if (key.userId !== keys[0].userId)
                    throw new ServerError(`All submitted post keys must be for the same follower`)
                return {
                    followRelationshipId: followRelationship.id,
                    ...key,
                }
            })
            await Keys.addPostKeys.run({ keysWithFollowerIds }, this.db.pool)
        })
    }
}
