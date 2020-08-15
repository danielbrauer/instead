import { mocked } from 'ts-jest/utils'
import * as Users from '../queries/users.gen'
import * as Followers from '../queries/followers.gen'
import * as FollowRequests from '../queries/follow_requests.gen'
import DatabaseService from './DatabaseService'
import UserService from './UserService'
import { NewUser } from 'auth'
import { FollowRelationship } from 'api'

jest.mock('../queries/users.gen')
jest.mock('../queries/followers.gen')
jest.mock('../queries/follow_requests.gen')
jest.mock('./DatabaseService')

describe('UserService', () => {
    let userService: UserService

    beforeAll(() => {
        const db = new DatabaseService()
        userService = new UserService(db)
        jest.useFakeTimers()
    })

    describe('getUserById', () => {
        test('should get user who exists', async () => {
            const userInstance: Users.IGetByIdResult = {
                id: 0,
                username: 'AntisocialAardvark',
                displayName: 'Randall',
            }
            mocked(Users.getById.run).mockResolvedValueOnce([userInstance])
            const user = await userService.getUserById(0)
            expect(user).toEqual(userInstance)
            expect(mocked(Users.getById.run).mock.calls[0][0]).toEqual({ userId: 0 })
        })

        test('should throw error if no such user', async () => {
            mocked(Users.getById.run).mockResolvedValueOnce([])
            await expect(userService.getUserById(0)).rejects.toThrow()
        })
    })

    describe('getLoginInfo', () => {
        test('should get user who exists', async () => {
            const userInstance: Users.IGetLoginInfoByNameResult = {
                id: 0,
                username: 'AntisocialAardvark',
                srpSalt: '0FFFF',
                verifier: '0FFFFF',
                displayName: 'Gerald',
            }
            mocked(Users.getLoginInfoByName.run).mockResolvedValueOnce([userInstance])
            const user = await userService.getLoginInfo(userInstance.username)
            expect(user).toEqual(userInstance)
            expect(mocked(Users.getLoginInfoByName.run).mock.calls[0][0]).toEqual({ username: userInstance.username })
        })

        test('should return null if no such user', async () => {
            mocked(Users.getLoginInfoByName.run).mockResolvedValueOnce([])
            const user = await userService.getLoginInfo('AntisocialAardvark')
            expect(user).toBeNull()
        })
    })

    describe('getUserInfo', () => {
        test('should get user who exists', async () => {
            const userInstance: Users.IGetUserInfoResult = {
                privateKey: 'aaaa',
                privateKeyIv: 'aaaaa',
                mukSalt: '0FFFF',
                publicKey: 'aaaaa',
            }
            mocked(Users.getUserInfo.run).mockResolvedValueOnce([userInstance])
            const user = await userService.getUserInfo(0)
            expect(mocked(Users.getUserInfo.run).mock.calls[0][0]).toEqual({ userId: 0 })
            expect(user).toEqual(userInstance)
        })

        test('should return null if no such user', async () => {
            mocked(Users.getUserInfo.run).mockResolvedValueOnce([])
            const user = await userService.getUserInfo(0)
            expect(user).toBeNull()
        })
    })

    describe('countByName', () => {
        test('should count user who exists', async () => {
            mocked(Users.countByName.run).mockResolvedValueOnce([{ count: 1 }])
            const count = await userService.countByName('AntisocialAardvark')
            expect(mocked(Users.countByName.run).mock.calls[0][0]).toEqual({ username: 'AntisocialAardvark' })
            expect(count).toEqual(1)
        })

        test('should return zero if no such user', async () => {
            mocked(Users.countByName.run).mockResolvedValueOnce([{ count: 0 }])
            const count = await userService.countByName('AntisocialAardvark')
            expect(count).toEqual(0)
        })
    })

    describe('create', () => {
        const newUser: NewUser = {
            username: 'AntisocialAardvark',
            displayName: 'Gerald',
            mukSalt: '0FFFF',
            srpSalt: '0FFFF',
            verifier: '0FFFFF',
            publicKey: { ktyp: 'asfd' },
            privateKey: 'asdfasdf',
            privateKeyIv: 'asdfasf',
        }

        test('should return created user id, and push notification', async () => {
            const newId: Users.ICreateResult = {
                id: 1,
            }
            let id = -1
            userService.onUserCreated.subscribe(async (createdId: number) => (id = createdId))
            mocked(Users.create.run).mockResolvedValueOnce([newId])
            const createdUser = await userService.create(newUser)
            expect(createdUser).toEqual(newId)
            expect(mocked(Users.create.run).mock.calls[0][0]).toEqual(newUser)
            jest.runAllTimers()
            expect(id).toEqual(newId.id)
        })

        test('should throw on error', async () => {
            mocked(Users.create.run).mockRejectedValueOnce(new Error('cant'))
            await expect(userService.create(newUser)).rejects.toThrow()
        })
    })

    describe('addFollowRequest', () => {
        const requestee: Users.IGetByNameResult = {
            id: 2,
        }

        test('should create a new request', async () => {
            mocked(Users.getByName.run).mockResolvedValueOnce([requestee])
            mocked(Followers.count.run).mockResolvedValueOnce([{ count: 0 }])
            mocked(FollowRequests.count.run).mockResolvedValueOnce([{ count: 0 }])
            await userService.addFollowRequest(0, 'AntisocialAardvark')
            expect(mocked(Users.getByName.run).mock.calls[0][0]).toEqual({ username: 'AntisocialAardvark' })
            expect(mocked(Followers.count.run).mock.calls[0][0]).toEqual({ followerId: 0, followeeId: requestee.id })
            expect(mocked(FollowRequests.count.run).mock.calls[0][0]).toEqual({
                requesterId: 0,
                requesteeId: requestee.id,
            })
        })

        test('should throw if requestee does not exist', async () => {
            mocked(Users.getByName.run).mockResolvedValueOnce([])
            await expect(userService.addFollowRequest(0, 'AntisocialAardvark')).rejects.toThrow()
        })

        test('should throw if requestee id is requester id', async () => {
            mocked(Users.getByName.run).mockResolvedValueOnce([requestee])
            await expect(userService.addFollowRequest(requestee.id, 'AntisocialAardvark')).rejects.toThrow()
        })

        test('should throw if already following', async () => {
            mocked(Users.getByName.run).mockResolvedValueOnce([requestee])
            mocked(Followers.count.run).mockResolvedValueOnce([{ count: 1 }])
            await expect(userService.addFollowRequest(0, 'AntisocialAardvark')).rejects.toThrow()
        })

        test('should throw if already requested', async () => {
            mocked(Users.getByName.run).mockResolvedValueOnce([requestee])
            mocked(Followers.count.run).mockResolvedValueOnce([{ count: 0 }])
            mocked(FollowRequests.count.run).mockResolvedValueOnce([{ count: 1 }])
            await expect(userService.addFollowRequest(0, 'AntisocialAardvark')).rejects.toThrow()
        })
    })

    describe('acceptFollowRequest', () => {
        test('should notify if follow is success', async () => {
            const request: FollowRequests.IDestroyAndReturnResult = {
                requesterId: 0,
                requesteeId: 1,
            }
            let notifiedRelationship: FollowRelationship
            mocked(FollowRequests.destroyAndReturn.run).mockResolvedValueOnce([request])
            userService.onUserAddedFollower.subscribe((relationship) => (notifiedRelationship = relationship))
            await userService.acceptFollowRequest(0, 1)
            expect(mocked(FollowRequests.destroyAndReturn.run).mock.calls[0][0]).toEqual(request)
            expect(mocked(Followers.create.run).mock.calls[0][0]).toEqual({ followerId: 0, followeeId: 1 })
            jest.runAllTimers()
            expect(notifiedRelationship.followerId).toEqual(0)
            expect(notifiedRelationship.followeeId).toEqual(1)
        })

        test('should throw if there was no such request', async () => {
            mocked(FollowRequests.destroyAndReturn.run).mockResolvedValueOnce([])
            await expect(userService.acceptFollowRequest(0, 1)).rejects.toThrow()
        })
    })

    describe('removeFollowRequest', () => {
        test('should destroy relationship', async () => {
            await userService.removeFollowRequest(0, 1)
            expect(mocked(FollowRequests.destroy.run).mock.calls[0][0]).toEqual({ requesterId: 0, requesteeId: 1 })
        })
    })

    describe('getFollowRequests', () => {
        test('should return requesters', async () => {
            const sampleRequests: FollowRequests.IGetByRequesteeIdResult[] = [
                { requesterId: 0 },
                { requesterId: 2 },
                { requesterId: 3 },
                { requesterId: 4 },
            ]
            mocked(FollowRequests.getByRequesteeId.run).mockResolvedValueOnce(sampleRequests)
            const result = await userService.getFollowRequests(1)
            expect(mocked(FollowRequests.getByRequesteeId.run).mock.calls[0][0]).toEqual({ requesteeId: 1 })
            expect(result).toEqual([0, 2, 3, 4])
        })
    })

    describe('getFollowers', () => {
        test('should return followers', async () => {
            const sampleFollowers: Followers.IGetByFolloweeIdResult[] = [
                { followerId: 0 },
                { followerId: 2 },
                { followerId: 3 },
                { followerId: 4 },
            ]
            mocked(Followers.getByFolloweeId.run).mockResolvedValueOnce(sampleFollowers)
            const result = await userService.getFollowers(1)
            expect(mocked(Followers.getByFolloweeId.run).mock.calls[0][0]).toEqual({ followeeId: 1 })
            expect(result).toEqual([0, 2, 3, 4])
        })
    })

    describe('getFollowers', () => {
        test('should return followers', async () => {
            const sampleFollowees: Followers.IGetByFollowerIdResult[] = [
                { followeeId: 0 },
                { followeeId: 2 },
                { followeeId: 3 },
                { followeeId: 4 },
            ]
            mocked(Followers.getByFollowerId.run).mockResolvedValueOnce(sampleFollowees)
            const result = await userService.getFollowees(1)
            expect(mocked(Followers.getByFollowerId.run).mock.calls[0][0]).toEqual({ followerId: 1 })
            expect(result).toEqual([0, 2, 3, 4])
        })
    })

    describe('removeFollower', () => {
        test('should notify if removal succeeds', async () => {
            const request: Followers.IDestroyResult = {
                followerId: 0,
                followeeId: 1,
            }
            let notifiedRelationship: FollowRelationship
            mocked(Followers.destroy.run).mockResolvedValueOnce([request])
            userService.onUserLostFollower.subscribe((relationship) => (notifiedRelationship = relationship))
            await userService.removeFollower(0, 1)
            expect(mocked(Followers.destroy.run).mock.calls[0][0]).toEqual(request)
            jest.runAllTimers()
            expect(notifiedRelationship.followerId).toEqual(0)
            expect(notifiedRelationship.followeeId).toEqual(1)
        })
    })
})
