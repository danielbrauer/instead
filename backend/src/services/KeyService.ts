import Container, { Service, Inject } from 'typedi'
import Database from './DatabaseService'
import * as Keys from '../queries/keys.gen'
import UserService from '../services/UserService'
import { FollowRelationship, EncryptedPostKey } from '../types/api'

@Service()
export default class KeyService {

    @Inject()
    private db: Database

    constructor(private userService: UserService) {
        this.userService.onUserAddedFollower.subscribe(KeyService.onFollowerChanged)
        this.userService.onUserLostFollower.subscribe(KeyService.onFollowerChanged)
    }

    async getCurrentKeySetId(userId: number) {
        const [{ currentPostKeySet }] = await Keys.getCurrentKeySetId.run({ userId }, this.db.pool)
        return currentPostKeySet
    }

    async getCurrentKey(userId: number) {
        const [key] = await Keys.getCurrentKey.run({ userId }, this.db.pool)
        return key
    }

    async getFollowerPublicKeys(userId: number) {
        const publicKeys = await Keys.getFollowerPublicKeys.run({ userId }, this.db.pool)
        return publicKeys
    }

    private static async onFollowerChanged(followRelationship: FollowRelationship) {
        await Container.get(KeyService).invalidateCurrentKeySet(followRelationship.followeeId)
    }

    async invalidateCurrentKeySet(userId: number) {
        await this.db.transaction(async client => {
            const [{ currentPostKeySet }] = await Keys.getCurrentKeySetId.run({ userId }, client)
            await Keys.setCurrentKeySetId.run({ userId, keySetId: null }, client)
            await Keys.endKeySetValidity.run({ keySetId: currentPostKeySet }, client)
        })
    }

    async createKeySet(userId: number, jwk: string) {
        let returnKeySetId: number = null
        await this.db.transaction(async client => {
            const [{ id: keySetId }] = await Keys.createKeySet.run({ ownerId: userId }, client)
            await Keys.setCurrentKeySetId.run({ userId, keySetId }, client)
            await Keys.addKeys.run({ keys: [{ userId, jwk, keySetId }] }, client)
            returnKeySetId = keySetId
        })
        return returnKeySetId
    }

    async addKeys(keys: EncryptedPostKey[]) {
        await Keys.addKeys.run({ keys }, this.db.pool)
    }
}