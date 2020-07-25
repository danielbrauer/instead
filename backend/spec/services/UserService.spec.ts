import { mocked } from 'ts-jest/utils'
import * as Users from '../../src/queries/users.gen'
import DatabaseService from '../../src/services/DatabaseService'
import UserService from '../../src/services/UserService'

jest.unmock('UserService')

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
            const user = userService.getUserById(0)
            expect(user).toEqual(userInstance)
        })
    })
})
