import KeyService from './KeyService'
import DatabaseService from './DatabaseService'
import UserService from './UserService'
import * as Keys from '../queries/keys.gen'
import { mocked } from 'ts-jest/utils'

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
})