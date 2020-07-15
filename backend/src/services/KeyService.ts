import { Service, Inject } from "typedi"
import Database from './DatabaseService'
import * as Keys from '../queries/keys.gen'
import UserService from '../services/UserService'
import { FollowRelationship } from '../types/api'

@Service()
export default class KeyService {

    @Inject()
    private db: Database

    @Inject()
    private userService: UserService

    constructor() {
        this.userService.onUserAddedFollower.subscribe(this.onFollowerChanged)
        this.userService.onUserLostFollower.subscribe(this.onFollowerChanged)
    }

    async getCurrentKeySetId(userId: number) {
        const [{ current_post_key_set }] = await Keys.getCurrentKeySetId.run({ userId }, this.db.pool)
        return current_post_key_set
    }

    async getCurrentKey(userId: number) {
        const [key] = await Keys.getCurrentKey.run({ userId }, this.db.pool)
        return key
    }

    async getFollowerPublicKeys(userId: number) {
        const publicKeys = await Keys.getFollowerPublicKeys.run({ userId }, this.db.pool)
        return publicKeys
    }

    async onFollowerChanged(followRelationship: FollowRelationship) {
        await this.invalidateCurrentKeySet(followRelationship.followeeId)
    }

    async invalidateCurrentKeySet(userId: number) {
        await this.db.transaction(async client => {
            const [{ current_post_key_set: currentKeySet }] = await Keys.getCurrentKeySetId.run({ userId }, client)
            await Keys.setCurrentKeySetId.run({ userId, keySetId: null }, client)
            await Keys.endKeySetValidity.run({ keySetId: currentKeySet }, client)
        })
    }

    async createKeySet(userId: number, jwk: string, iv: string) {
        let returnKeySetId: number = null
        await this.db.transaction(async client => {
            const [{ id: keySetId }] = await Keys.createKeySet.run({ ownerId: userId }, client)
            await Keys.setCurrentKeySetId.run({ userId, keySetId }, client)
            await Keys.addKey.run({ userId, jwk, iv, keySetId }, client)
            returnKeySetId = keySetId
        })
        return returnKeySetId
    }

    async createKey(userId: number, keySetId: number, jwk: string, iv: string) {
        await Keys.addKey.run({ userId, keySetId, jwk, iv }, this.db.pool)
    }
}