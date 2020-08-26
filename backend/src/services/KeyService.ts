import { Service } from 'typedi'
import DatabaseService from './DatabaseService'
import * as Keys from '../queries/keys.gen'
import * as Types from '../types/api'
import { ServerError } from '../middleware/errors'

@Service()
export default class KeyService {
    constructor(private db: DatabaseService) {}

    async getCurrentPostKey(userId: number) {
        const [key] = await Keys.getCurrentPostKey.run({ userId }, this.db.pool)
        return key || null
    }

    async getPostKey(userId: number, keySetId: number) {
        const [key] = await Keys.getPostKey.run({ userId, keySetId }, this.db.pool)
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

    async createCurrentPostKeySet(userId: number, key: string) {
        const [{ postKeySetId }] = await Keys.createCurrentPostKeySet.run(
            { ownerId: userId, key },
            this.db.pool,
        )
        return postKeySetId
    }

    async addPostKeys(userId: number, keys: Types.EncryptedPostKey[]) {
        const postKeySets = await Keys.getAllPostKeys.run({ userId }, this.db.pool)
        keys.forEach((key) => {
            if (!postKeySets.some((keySet) => keySet.id === key.postKeySetId))
                throw new ServerError(
                    'Cannot add post keys belonging to key sets owned by other users',
                )
        })
        await Keys.addPostKeys.run({ keys }, this.db.pool)
    }

    async getCurrentProfileKey(userId: number) {
        const [key] = await Keys.getCurrentProfileKey.run({ userId }, this.db.pool)
        return key || null
    }

    async getProfileViewersPublicKeys(userId: number) {
        const keys = await Keys.getProfileViewerPublicKeys.run({ userId }, this.db.pool)
        return keys
    }

    async createProfileKey(
        userId: number,
        ownerKey: string,
        viewerKeys: Types.EncryptedProfileViewerKey[],
    ) {
        viewerKeys.forEach((key) => {
            if (key.ownerId != userId)
                throw new ServerError('Keys must all belong to the same owner')
        })
        await Keys.createProfileKey.run({ userId, key: ownerKey, viewerKeys }, this.db.pool)
    }

    async addProfileKey(viewerKey: Types.EncryptedProfileViewerKey) {
        await Keys.addProfileKey.run(viewerKey, this.db.pool)
    }
}
