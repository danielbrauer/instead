import { Service, Inject } from 'typedi'
import srp from 'secure-remote-password/server'
import crypto from '../util/crypto-promise'
import { generateCombination } from '../util/animalGenerator'
import { requireString } from '../config/config'
import UserService from './UserService'
import { StartLoginResult, FinishLoginResult, StartSignupResult, FinishSignupResult, NewUser } from 'auth'

@Service()
export default class AuthService {

    @Inject()
    private userService: UserService

    async startLogin(session: Express.Session, username: string, clientEphemeralPublic: string): Promise<StartLoginResult> {
        if (session.user)
            throw new Error('Session already started logging in')
        const user = await this.userService.getLoginInfo(username)
        if (user) {
            const serverEphemeral = srp.generateEphemeral(user.verifier)
            session.loginInfo = {
                loginFake: false,
                user,
                clientEphemeralPublic,
                serverEphemeralSecret: serverEphemeral.secret
            }
            return {
                srpSalt: user.srpSalt,
                serverEphemeralPublic: serverEphemeral.public,
            }
        } else {
            const bytes = await crypto.randomBytes(256)
            const hash = crypto.createHash('sha256').update(username).update(requireString('GARBAGE_SEED'))
            session.loginInfo = {
                loginFake: true,
            }
            return {
                srpSalt: hash.digest('hex').substring(32),
                serverEphemeralPublic: bytes.toString('hex'),
            }
        }
    }

    async finishLogin(session: Express.Session, clientSessionProof: string): Promise<FinishLoginResult> {
        if (!session.loginInfo)
            throw new Error('Missing startLogin')
        if (session.loginInfo.loginFake)
            throw new Error('No such user')
        const loginInfo = session.loginInfo
        const serverSession = srp.deriveSession(
            loginInfo.serverEphemeralSecret,
            loginInfo.clientEphemeralPublic,
            loginInfo.user.srpSalt,
            loginInfo.user.username,
            loginInfo.user.verifier,
            clientSessionProof
        )
        session.user = { id: loginInfo.user.id, username: loginInfo.user.username }
        const { privateKey, privateKeyIv, publicKey, mukSalt } = await this.userService.getUserInfo(session.user.id)
        delete session.loginInfo
        return {
            userid: session.user.id,
            serverSessionProof: serverSession.proof,
            displayName: loginInfo.user.displayName,
            privateKey,
            privateKeyIv,
            publicKey: publicKey as JsonWebKey,
            mukSalt,
        }
    }

    async startSignup(session: Express.Session): Promise<StartSignupResult>{
        let username = ''
        for (let i = 0; i < 5; ++i) {
            username = generateCombination(1, '', true)
            const count = await this.userService.countByName(username)
            if (count == 0) {
                session.signupInfo = { username }
                return { username }
            }
        }
        throw new Error('Too many user name collisions!')
    }

    async finishSignup(
        session: Express.Session,
        newUser: NewUser,
    ): Promise<FinishSignupResult> {
        if (!session.signupInfo)
            throw new Error('Session hasn\'t started signing in')
        const newUserResult = await this.userService.create(newUser)
        session.user = { username: session.signupInfo.username, id: newUserResult.id }
        delete session.signupInfo
        return { user: session.user }
    }
}