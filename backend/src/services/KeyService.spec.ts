import KeyService from './KeyService'
import DatabaseService from './DatabaseService'
import UserService from './UserService'
import * as Keys from '../queries/keys.gen'
import { mocked } from 'ts-jest/utils'
import { EncryptedPostKey } from 'api'

jest.mock('./DatabaseService')
jest.mock('./UserService')
jest.mock('../queries/keys.gen')

describe('KeyService', () => {

    let keyService: KeyService

    beforeAll(() => {
        const db = new DatabaseService()
        const userService = new UserService(db)
        keyService = new KeyService(userService, db)
    })

    beforeEach(() => {
        jest.resetAllMocks()
    })

    describe('getCurrentKey', () => {
        test('gets key if it exists', async() => {
            const key: Keys.IGetCurrentKeyResult = {
                keySetId: 3,
                key: 'FF',
                userId: 0
            }
            mocked(Keys.getCurrentKey.run).mockResolvedValueOnce([key])
            const currentKey = await keyService.getCurrentKey(0)
            expect(mocked(Keys.getCurrentKey.run).mock.calls[0][0]).toEqual({ userId: 0 })
            expect(currentKey).toEqual(key)
        })

        test('gets null if there isn\'t one', async() => {
            mocked(Keys.getCurrentKey.run).mockResolvedValueOnce([])
            const currentKey = await keyService.getCurrentKey(0)
            expect(currentKey).toBeNull()
        })
    })

    describe('getFollowerPublicKeys', () => {
        test('gets public keys of followers', async() => {
            const keys: Keys.IGetFollowerPublicKeysResult[] = [
                {
                    id: 0,
                    publicKey: {key: 'type'}
                }
            ]
            mocked(Keys.getFollowerPublicKeys.run).mockResolvedValueOnce(keys)
            const publicKeys = await keyService.getFollowerPublicKeys(1)
            expect(mocked(Keys.getFollowerPublicKeys.run).mock.calls[0][0]).toEqual({ userId: 1 })
            expect(publicKeys).toEqual(keys)
        })

        test('returns an empty list if there are no followers', async() => {
            mocked(Keys.getFollowerPublicKeys.run).mockResolvedValueOnce([])
            const publicKeys = await keyService.getFollowerPublicKeys(1)
            expect(mocked(Keys.getFollowerPublicKeys.run).mock.calls[0][0]).toEqual({ userId: 1 })
            expect(publicKeys).toHaveLength(0)
        })
    })

    describe('invalidateCurrentKeySet', () => {
        test('makes the expected database queries when there is a key', async() => {
            const key: Keys.IGetCurrentKeyResult = {
                keySetId: 3,
                key: 'FF',
                userId: 0
            }
            mocked(Keys.getCurrentKey.run).mockResolvedValueOnce([key])
            await keyService.invalidateCurrentKeySet(0)
            expect(mocked(Keys.getCurrentKey.run).mock.calls[0][0]).toEqual({ userId: 0 })
            expect(mocked(Keys.endKeySetValidity.run).mock.calls[0][0]).toEqual({ keySetId: 3 })
        })

        test('throws if the key isn\'t valid', async() => {
            mocked(Keys.getCurrentKey.run).mockResolvedValueOnce([])
            await keyService.invalidateCurrentKeySet(0)
            expect(mocked(Keys.endKeySetValidity.run)).toHaveBeenCalledTimes(0)
        })
    })

    describe('createKeySet', () => {
        test('creates key set with user copy, and returns id', async() => {
            const createdKeySet: Keys.ICreateKeySetResult = {
                id: 5
            }
            mocked(Keys.createKeySet.run).mockResolvedValueOnce([createdKeySet])
            const returnedId = await keyService.createKeySet(0, 'key')
            expect(mocked(Keys.createKeySet.run).mock.calls[0][0]).toEqual({ ownerId: 0 })
            expect(mocked(Keys.addKeys.run).mock.calls[0][0]).toEqual({
                keys: [{
                    userId: 0,
                    key: 'key',
                    keySetId: 5
                }]
            })
            expect(returnedId).toEqual(5)
        })
    })

    describe('addKeys', () => {
        test('adds supplied keys', async() => {
            const keys: EncryptedPostKey[] = [{
                userId: 0,
                key: 'key',
                keySetId: 5
            }]
            await keyService.addKeys(keys)
            expect(mocked(Keys.addKeys.run).mock.calls[0][0]).toEqual({ keys })
        })
    })

    describe('removeFollowerKeys', () => {
        test('removes keys for relationship', async() => {
            await keyService.removeFollowerKeys(0, 1)
            expect(mocked(Keys.removeFollowerKeys.run).mock.calls[0][0]).toEqual({ followerId: 0, followeeId: 1 })
        })
    })
})