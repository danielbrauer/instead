import { mocked } from 'ts-jest/utils'
import DatabaseService from './DatabaseService'

jest.mock('pg')
jest.mock('pg-camelcase')
jest.mock('../config/config')

describe('DatabaseService', () => {

    let databaseService: DatabaseService

    beforeAll(() => {
        databaseService = new DatabaseService()
    })

    describe('transaction', () => {

        const dummyClient = {
            query: jest.fn((x: string) => { /* mock */ }),
            release: jest.fn(() => { /* mock */ }),
        }

        beforeEach(async() => {
            mocked(databaseService.pool).connect.mockImplementation(() => dummyClient)
        })

        afterEach(() => {
            jest.resetAllMocks()
        })

        test('releases on completion', async() => {
            await databaseService.transaction(async(client) => {
                client.query('TEST')
            })

            expect(dummyClient.query.mock.calls).toHaveLength(3)
            expect(dummyClient.query.mock.calls[0][0]).toEqual('BEGIN')
            expect(dummyClient.query.mock.calls[1][0]).toEqual('TEST')
            expect(dummyClient.query.mock.calls[2][0]).toEqual('COMMIT')
            expect(dummyClient.release.mock.calls).toHaveLength(1)
        })

        test('rolls back on throw', async() => {
            await expect(databaseService.transaction((client) => {
                client.query('TEST')
                throw new Error()
            })).rejects.toThrow()

            expect(dummyClient.query.mock.calls).toHaveLength(3)
            expect(dummyClient.query.mock.calls[0][0]).toEqual('BEGIN')
            expect(dummyClient.query.mock.calls[1][0]).toEqual('TEST')
            expect(dummyClient.query.mock.calls[2][0]).toEqual('ROLLBACK')
            expect(dummyClient.release.mock.calls).toHaveLength(1)
        })
    })
})