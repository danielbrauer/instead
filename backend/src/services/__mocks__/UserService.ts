import { SimpleEventDispatcher } from 'strongly-typed-events'
import { FollowRelationship } from '../../types/api'
import UserService from '../UserService'
const UserServiceMock = jest.genMockFromModule<typeof UserService>('../UserService')

const _onUserAddedFollower = new SimpleEventDispatcher<FollowRelationship>()
const _onUserLostFollower = new SimpleEventDispatcher<FollowRelationship>()

Object.defineProperty(UserServiceMock, 'onUserAddedFollower', {
    get: function () {
        return _onUserAddedFollower.asEvent()
    },
})

Object.defineProperty(UserServiceMock, 'onUserLostFollower', {
    get: function () {
        return _onUserLostFollower.asEvent()
    },
})

export default jest.fn().mockImplementation(() => UserServiceMock)
