import { mocked } from 'ts-jest/utils'
import * as Users from '../queries/users.gen'
import DatabaseService from './DatabaseService'
import UserService from './UserService'

jest.mock('../queries/users.gen')
jest.mock('./DatabaseService')

describe('User service unit tests', () => {

    let userService: UserService

    beforeAll(() => {
        userService = new UserService(new DatabaseService())
    })

    describe('getUserById', () => {

        test('Should get user who exists', async () => {
            const userInstance: Users.IGetByIdResult = {
                id: 0,
                username: 'AntisocialAardvark',
            }
            mocked(Users.getById.run).mockResolvedValueOnce([userInstance])
            const user = await userService.getUserById(0)
            expect(user).toEqual(userInstance)
        })

        test('Should throw error if no such user', async () => {
            mocked(Users.getById.run).mockResolvedValueOnce([])
            await expect(userService.getUserById(0)).rejects.toThrow()
        })
    })
})
