import { Service, Inject } from 'typedi'
import srp from 'secure-remote-password/server'
import crypto from '../util/crypto-promise'
import * as config from '../config/config'
import UserService from './UserService'
import { StartLoginResult, FinishLoginResult, NewUser } from 'auth'

@Service()
export default class AuthService {
    @Inject()
    private userService: UserService

    async startLogin(
        session: Express.Session,
        username: string,
        clientEphemeralPublic: string,
    ): Promise<StartLoginResult> {
        if (session.loginInfo) throw new Error('Session already started logging in')
        const user = await this.userService.getLoginInfo(username)
        if (user) {
            const serverEphemeral = srp.generateEphemeral(user.verifier)
            session.loginInfo = {
                loginFake: false,
                user,
                clientEphemeralPublic,
                serverEphemeralSecret: serverEphemeral.secret,
            }
            return {
                srpSalt: user.srpSalt,
                serverEphemeralPublic: serverEphemeral.public,
            }
        } else {
            const bytes = await crypto.randomBytes(256)
            const hash = crypto
                .createHash('sha256')
                .update(username)
                .update(config.string('GARBAGE_SEED'))
            session.loginInfo = {
                loginFake: true,
            }
            return {
                srpSalt: hash.digest('hex').substring(32),
                serverEphemeralPublic: bytes.toString('hex'),
            }
        }
    }

    async finishLogin(
        session: Express.Session,
        clientSessionProof: string,
    ): Promise<FinishLoginResult> {
        if (!session.loginInfo) throw new Error('Missing startLogin')
        if (session.loginInfo.loginFake) throw new Error('No such user')
        const loginInfo = session.loginInfo
        const serverSession = srp.deriveSession(
            loginInfo.serverEphemeralSecret,
            loginInfo.clientEphemeralPublic,
            loginInfo.user.srpSalt,
            loginInfo.user.username,
            loginInfo.user.verifier,
            clientSessionProof,
        )
        session.userId = loginInfo.user.id
        const { privateKey, privateKeyIv, publicKey, mukSalt } = await this.userService.getUserInfo(
            session.userId,
        )
        delete session.loginInfo
        return {
            userId: session.userId,
            serverSessionProof: serverSession.proof,
            privateKey,
            privateKeyIv,
            publicKey: publicKey as JsonWebKey,
            mukSalt,
        }
    }

    async signup(newUser: NewUser) {
        await this.userService.create(newUser)
    }
}
