import { SimpleEventDispatcher } from 'strongly-typed-events'
import AuthService from '../AuthService'
const AuthServiceMock = jest.genMockFromModule<typeof AuthService>('../AuthService')

const _onUserCreated = new SimpleEventDispatcher<number>()

Object.defineProperty(AuthServiceMock, 'onUserCreated', {
    get: function () {
        return _onUserCreated.asEvent()
    },
})

export default jest.fn().mockImplementation(() => AuthServiceMock)
