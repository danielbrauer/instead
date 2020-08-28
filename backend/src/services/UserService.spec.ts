import { mocked } from 'ts-jest/utils'
import * as FollowRelationships from '../queries/follow_relationships.gen'
import * as FollowRequests from '../queries/follow_requests.gen'
import * as Users from '../queries/users.gen'
import { FollowRelationship } from '../types/api'
import AuthService from './AuthService'
import DatabaseService from './DatabaseService'
import UserService from './UserService'

jest.mock('../queries/users.gen')
jest.mock('../queries/followers.gen')
jest.mock('../queries/follow_requests.gen')
jest.mock('./DatabaseService')
jest.mock('./AuthService')

describe('UserService', () => {
    let userService: UserService

    beforeAll(() => {
        const db = new DatabaseService()
        const auth = new AuthService(db)
        userService = new UserService(db, auth)
        jest.useFakeTimers()
    })

    describe('getProfileWithKey', () => {
        test('should get user who exists', async () => {
            const userInstance: Users.IGetProfileWithKeyResult = {
                id: 0,
                displayName: 'someBase64',
                displayNameIv: 'moreBase64',
                key: 'someMoreBase85',
            }
            mocked(Users.getProfileWithKey.run).mockResolvedValueOnce([userInstance])
            const user = await userService.getUserProfileWithKey(0, 1)
            expect(user).toEqual(userInstance)
            expect(mocked(Users.getProfileWithKey.run).mock.calls[0][0]).toEqual({ userId: 0 })
        })
    })

    describe('addFollowRequestByCode', () => {
        const requestee: Users.IGetByFriendCodeResult = {
            id: 2,
        }

        test('should create a new request', async () => {
            mocked(Users.getByFriendCode.run).mockResolvedValueOnce([requestee])
            mocked(FollowRelationships.count.run).mockResolvedValueOnce([{ count: 0 }])
            mocked(FollowRequests.count.run).mockResolvedValueOnce([{ count: 0 }])
            await userService.addFollowRequestByCode(0, 'MMM')
            expect(mocked(Users.getByFriendCode.run).mock.calls[0][0]).toEqual({
                friendCode: 'MMM',
            })
            expect(mocked(FollowRelationships.count.run).mock.calls[0][0]).toEqual({
                followerId: 0,
                followeeId: requestee.id,
            })
            expect(mocked(FollowRequests.count.run).mock.calls[0][0]).toEqual({
                requesterId: 0,
                requesteeId: requestee.id,
            })
        })

        test('should throw if requestee does not exist', async () => {
            mocked(Users.getByFriendCode.run).mockResolvedValueOnce([])
            await expect(
                userService.addFollowRequestByCode(0, 'AntisocialAardvark'),
            ).rejects.toThrow()
        })

        test('should throw if requestee id is requester id', async () => {
            mocked(Users.getByFriendCode.run).mockResolvedValueOnce([requestee])
            await expect(
                userService.addFollowRequestByCode(requestee.id, 'AntisocialAardvark'),
            ).rejects.toThrow()
        })

        test('should throw if already following', async () => {
            mocked(Users.getByFriendCode.run).mockResolvedValueOnce([requestee])
            mocked(FollowRelationships.count.run).mockResolvedValueOnce([{ count: 1 }])
            await expect(
                userService.addFollowRequestByCode(0, 'AntisocialAardvark'),
            ).rejects.toThrow()
        })

        test('should throw if already requested', async () => {
            mocked(Users.getByFriendCode.run).mockResolvedValueOnce([requestee])
            mocked(FollowRelationships.count.run).mockResolvedValueOnce([{ count: 0 }])
            mocked(FollowRequests.count.run).mockResolvedValueOnce([{ count: 1 }])
            await expect(
                userService.addFollowRequestByCode(0, 'AntisocialAardvark'),
            ).rejects.toThrow()
        })
    })

    describe('acceptFollowRequest', () => {
        test('should notify if follow is success', async () => {
            const request: FollowRequests.IGetByIdsResult = {
                id: 0,
            }
            let notifiedRelationship: FollowRelationship
            mocked(FollowRequests.getByIds.run).mockResolvedValueOnce([request])
            userService.onUserAddedFollower.subscribe(
                (relationship) => (notifiedRelationship = relationship),
            )
            await userService.acceptFollowRequest(0, 1)
            expect(mocked(FollowRequests.destroy.run).mock.calls[0][0]).toEqual({
                requesterId: 0,
                requesteeId: 1,
            })
            expect(mocked(FollowRelationships.create.run).mock.calls[0][0]).toEqual({
                followerId: 0,
                followeeId: 1,
            })
            jest.runAllTimers()
            expect(notifiedRelationship.followerId).toEqual(0)
            expect(notifiedRelationship.followeeId).toEqual(1)
        })

        test('should throw if there was no such request', async () => {
            mocked(FollowRequests.destroy.run).mockResolvedValueOnce([])
            await expect(userService.acceptFollowRequest(0, 1)).rejects.toThrow()
        })
    })

    describe('removeFollowRequest', () => {
        test('should destroy relationship', async () => {
            await userService.removeFollowRequest(0, 1)
            expect(mocked(FollowRequests.destroy.run).mock.calls[0][0]).toEqual({
                requesterId: 0,
                requesteeId: 1,
            })
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
            expect(mocked(FollowRequests.getByRequesteeId.run).mock.calls[0][0]).toEqual({
                requesteeId: 1,
            })
            expect(result).toEqual([0, 2, 3, 4])
        })
    })

    describe('getFollowers', () => {
        test('should return followers', async () => {
            const sampleFollowers: FollowRelationships.IGetByFolloweeIdResult[] = [
                { id: 0, followerId: 0 },
                { id: 1, followerId: 2 },
                { id: 2, followerId: 3 },
                { id: 3, followerId: 4 },
            ]
            mocked(FollowRelationships.getByFolloweeId.run).mockResolvedValueOnce(sampleFollowers)
            const result = await userService.getFollowers(1)
            expect(mocked(FollowRelationships.getByFolloweeId.run).mock.calls[0][0]).toEqual({
                followeeId: 1,
            })
            expect(result).toEqual([0, 2, 3, 4])
        })
    })

    describe('getFollowers', () => {
        test('should return followers', async () => {
            const sampleFollowees: FollowRelationships.IGetByFollowerIdResult[] = [
                { followeeId: 0 },
                { followeeId: 2 },
                { followeeId: 3 },
                { followeeId: 4 },
            ]
            mocked(FollowRelationships.getByFollowerId.run).mockResolvedValueOnce(sampleFollowees)
            const result = await userService.getFollowees(1)
            expect(mocked(FollowRelationships.getByFollowerId.run).mock.calls[0][0]).toEqual({
                followerId: 1,
            })
            expect(result).toEqual([0, 2, 3, 4])
        })
    })

    describe('removeFollower', () => {
        test('should notify if removal succeeds', async () => {
            const request: FollowRelationships.IDestroyResult = {
                followerId: 0,
                followeeId: 1,
            }
            let notifiedRelationship: FollowRelationship
            mocked(FollowRelationships.destroy.run).mockResolvedValueOnce([request])
            userService.onUserLostFollower.subscribe(
                (relationship) => (notifiedRelationship = relationship),
            )
            await userService.removeFollower(0, 1)
            expect(mocked(FollowRelationships.destroy.run).mock.calls[0][0]).toEqual(request)
            jest.runAllTimers()
            expect(notifiedRelationship.followerId).toEqual(0)
            expect(notifiedRelationship.followeeId).toEqual(1)
        })
    })
})
