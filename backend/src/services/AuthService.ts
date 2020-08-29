import { Service } from 'typedi'
import DatabaseService from './DatabaseService'
import * as UsersAuth from '../queries/users-auth.gen'
import srp from 'secure-remote-password/server'
import crypto from '../util/crypto-promise'
import * as config from '../config/config'
import { StartLoginResult, FinishLoginResult, NewUser } from 'auth'
import { SimpleEventDispatcher } from 'strongly-typed-events'
import { ServerError } from '../middleware/errors'

@Service()
export default class AuthService {
    private _onUserCreated = new SimpleEventDispatcher<number>()

    public get onUserCreated() {
        return this._onUserCreated.asEvent()
    }

    constructor(private db: DatabaseService) {}

    async startLogin(
        session: Express.Session,
        username: string,
        clientEphemeralPublic: string,
    ): Promise<StartLoginResult> {
        if (session.loginInfo) throw new Error('Session already started logging in')
        const [user] = await UsersAuth.getLoginInfoByName.run({ username }, this.db.pool)
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
        const [{ privateKey, privateKeyIv, publicKey, mukSalt }] = await UsersAuth.getUserInfo.run(
            { userId: session.userId },
            this.db.pool,
        )
        if (privateKey === undefined) throw new Error('Could not find info for user')
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
        await this.db.transaction(async (client) => {
            const [{ count }] = await UsersAuth.countByName.run(
                { username: newUser.username },
                client,
            )
            if (count > 0) throw new ServerError(`Username '${newUser.username}' is already taken`)
            const [user] = await UsersAuth.create.run(newUser, client)
            this._onUserCreated.dispatchAsync(user.id)
        })
    }
}
