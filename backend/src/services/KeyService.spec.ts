import { mocked } from 'ts-jest/utils'
import * as Keys from '../queries/keys.gen'
import { EncryptedPostKey } from '../types/api'
import AuthService from './AuthService'
import DatabaseService from './DatabaseService'
import KeyService from './KeyService'
import UserService from './UserService'

jest.mock('./DatabaseService')
jest.mock('./UserService')
jest.mock('./AuthService')
jest.mock('../queries/keys.gen')

describe('KeyService', () => {
    let keyService: KeyService

    beforeAll(() => {
        const db = new DatabaseService()
        const auth = new AuthService(db)
        const userService = new UserService(db, auth)
        keyService = new KeyService(db)
    })

    beforeEach(() => {
        jest.resetAllMocks()
    })

    describe('getCurrentPostKey', () => {
        test('gets key if it exists', async () => {
            const key: Keys.IGetCurrentPostKeyResult = {
                id: 0,
                postKeySetId: 3,
                key: 'FF',
                recipientId: 0,
                followRelationshipId: 0,
            }
            mocked(Keys.getCurrentPostKey.run).mockResolvedValueOnce([key])
            const currentKey = await keyService.getCurrentPostKey(0)
            expect(mocked(Keys.getCurrentPostKey.run).mock.calls[0][0]).toEqual({ userId: 0 })
            expect(currentKey).toEqual(key)
        })

        test("gets null if there isn't one", async () => {
            mocked(Keys.getCurrentPostKey.run).mockResolvedValueOnce([])
            const currentKey = await keyService.getCurrentPostKey(0)
            expect(currentKey).toBeNull()
        })
    })

    describe('getFollowerPublicKeys', () => {
        test('gets public keys of followers', async () => {
            const keys: Keys.IGetFollowerPublicKeysResult[] = [
                {
                    id: 0,
                    publicKey: { key: 'type' },
                },
            ]
            mocked(Keys.getFollowerPublicKeys.run).mockResolvedValueOnce(keys)
            const publicKeys = await keyService.getFollowerPublicKeys(1)
            expect(mocked(Keys.getFollowerPublicKeys.run).mock.calls[0][0]).toEqual({ userId: 1 })
            expect(publicKeys).toEqual(keys)
        })

        test('returns an empty list if there are no followers', async () => {
            mocked(Keys.getFollowerPublicKeys.run).mockResolvedValueOnce([])
            const publicKeys = await keyService.getFollowerPublicKeys(1)
            expect(mocked(Keys.getFollowerPublicKeys.run).mock.calls[0][0]).toEqual({ userId: 1 })
            expect(publicKeys).toHaveLength(0)
        })
    })

    describe('createCurrentPostKeySet', () => {
        test('creates key set with user copy, and returns id', async () => {
            const createdKeySet: Keys.ICreateCurrentPostKeySetResult = {
                postKeySetId: 5,
            }
            mocked(Keys.createCurrentPostKeySet.run).mockResolvedValueOnce([createdKeySet])
            const returnedId = await keyService.createCurrentPostKeySet(0, 'key')
            expect(mocked(Keys.createCurrentPostKeySet.run).mock.calls[0][0]).toEqual({
                ownerId: 0,
            })
            expect(mocked(Keys.addPostKeys.run).mock.calls[0][0]).toEqual({
                keys: [
                    {
                        userId: 0,
                        key: 'key',
                        keySetId: 5,
                    },
                ],
            })
            expect(returnedId).toEqual(5)
        })
    })

    describe('addKeys', () => {
        test('adds supplied keys', async () => {
            const keys: EncryptedPostKey[] = [
                {
                    recipientId: 0,
                    key: 'key',
                    postKeySetId: 5,
                },
            ]
            await keyService.addPostKeys(1, keys)
            expect(mocked(Keys.addPostKeys.run).mock.calls[0][0]).toEqual({ keys })
        })
    })
})
