import Container, { Service } from 'typedi'
import DatabaseService from './DatabaseService'
import * as Keys from '../queries/keys.gen'
import UserService from './UserService'
import { FollowRelationship, EncryptedPostKey } from '../types/api'

@Service()
export default class KeyService {

    constructor(private userService: UserService, private db: DatabaseService) {
        this.userService.onUserAddedFollower.subscribe(KeyService.onFollowerChanged)
        this.userService.onUserLostFollower.subscribe(KeyService.onFollowerChanged)
    }

    private static async onFollowerChanged(followRelationship: FollowRelationship) {
        await Container.get(KeyService).invalidateCurrentKeySet(followRelationship.followeeId)
    }

    async getCurrentKey(userId: number) {
        const [key] = await Keys.getCurrentKey.run({ userId }, this.db.pool)
        return key || null
    }

    async getFollowerPublicKeys(userId: number) {
        const publicKeys = await Keys.getFollowerPublicKeys.run({ userId }, this.db.pool)
        return publicKeys
    }

    async invalidateCurrentKeySet(userId: number) {
        await this.db.transaction(async client => {
            const [key] = await Keys.getCurrentKey.run({ userId }, client)
            if (key) {
                await Keys.endKeySetValidity.run({ keySetId: key.keySetId }, client)
            }
        })
    }

    async createKeySet(userId: number, key: string) {
        let returnKeySetId: number = null
        await this.db.transaction(async client => {
            const [{ id: keySetId }] = await Keys.createKeySet.run({ ownerId: userId }, client)
            await Keys.addKeys.run({ keys: [{userId, key, keySetId}] }, client)
            returnKeySetId = keySetId
        })
        return returnKeySetId
    }

    async addKeys(keys: EncryptedPostKey[]) {
        await Keys.addKeys.run({ keys }, this.db.pool)
    }
}
