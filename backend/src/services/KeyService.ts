import Container, { Service } from 'typedi'
import DatabaseService from './DatabaseService'
import * as Keys from '../queries/keys.gen'
import UserService from './UserService'
import { FollowRelationship, EncryptedPostKey } from '../types/api'

@Service()
export default class KeyService {
    constructor(private userService: UserService, private db: DatabaseService) {
        this.userService.onUserLostFollower.subscribe(KeyService.onFollowerLost)
    }

    private static async onFollowerLost(followRelationship: FollowRelationship) {
        const keyService = Container.get(KeyService)
        await Promise.all([
            keyService.removeFollowerKeys(
                followRelationship.followerId,
                followRelationship.followeeId,
            ),
            keyService.invalidateCurrentKeySet(followRelationship.followeeId),
        ])
    }

    async getCurrentKey(userId: number) {
        const [key] = await Keys.getCurrentKey.run({ userId }, this.db.pool)
        return key || null
    }

    async getKey(userId: number, keySetId: number) {
        const [key] = await Keys.getKey.run({ userId, keySetId }, this.db.pool)
        return key || null
    }

    async getAllKeys(userId: number) {
        return await Keys.getAllKeys.run({ userId }, this.db.pool)
    }

    async getFollowerPublicKeys(userId: number) {
        const publicKeys = await Keys.getFollowerPublicKeys.run({ userId }, this.db.pool)
        return publicKeys
    }

    async getPublicKey(userId: number) {
        const [publicKey] = await Keys.getPublicKey.run({ userId }, this.db.pool)
        return publicKey || null
    }

    async invalidateCurrentKeySet(userId: number) {
        await this.db.transaction(async (client) => {
            const [key] = await Keys.getCurrentKey.run({ userId }, client)
            if (key) {
                await Keys.endKeySetValidity.run({ keySetId: key.keySetId }, client)
            }
        })
    }

    async createKeySet(userId: number, key: string) {
        let returnKeySetId: number = null
        await this.db.transaction(async (client) => {
            const [{ id: keySetId }] = await Keys.createKeySet.run({ ownerId: userId }, client)
            await Keys.addKeys.run({ keys: [{ userId, key, keySetId }] }, client)
            returnKeySetId = keySetId
        })
        return returnKeySetId
    }

    async addKeys(keys: EncryptedPostKey[]) {
        await Keys.addKeys.run({ keys }, this.db.pool)
    }

    async removeFollowerKeys(followerId: number, followeeId: number) {
        await Keys.removeFollowerKeys.run({ followerId, followeeId }, this.db.pool)
    }
}
