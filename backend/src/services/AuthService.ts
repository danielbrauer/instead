import { Service, Inject } from "typedi"
import srp from 'secure-remote-password/server'
import crypto from '../util/crypto-promise'
import { generateCombination } from '../util/animalGenerator'
import config from '../config/config'
import UserService from "./UserService"

@Service()
export default class AuthService {

    @Inject()
    private userService: UserService

    async startLogin(session: Express.Session, username: string, clientEphemeralPublic : string) {
        if (session.user)
            throw new Error('Session already started logging in')
        const user = await this.userService.getLoginInfo(username)
        if (user) {
            const serverEphemeral = srp.generateEphemeral(user.verifier)
            session.loginInfo = {
                user,
                clientEphemeralPublic,
                serverEphemeralSecret: serverEphemeral.secret
            }
            return {
                srpSalt: user.srp_salt,
                serverEphemeralPublic: serverEphemeral.public,
            }
        } else {
            const bytes = await crypto.randomBytes(256)
            const hash = crypto.createHash('sha256').update(username).update(config.garbageSeed)
            session.loginFake = true
            return {
                srpSalt: hash.digest('hex').substring(32),
                serverEphemeralPublic: bytes.toString('hex'),
            }
        }
    }

    async finishLogin(session: Express.Session, clientSessionProof: string) {
        if (session.loginFake)
            throw new Error('No such user')
        if (!session.loginInfo)
            throw new Error('Missing startLogin')
        const loginInfo = session.loginInfo
        const serverSession = srp.deriveSession(
            loginInfo.serverEphemeralSecret,
            loginInfo.clientEphemeralPublic,
            loginInfo.user.srp_salt,
            loginInfo.user.username,
            loginInfo.user.verifier,
            clientSessionProof
        )
        session.user = { id: loginInfo.user.id }
        delete session.loginInfo
        return {
            userid: session.user.id,
            serverSessionProof: serverSession.proof,
            displayName: session.user.displayName,
        }
    }

    async startSignup(session: Express.Session) {
        let username = ''
        for (let i = 0; i < 5; ++i) {
            username = generateCombination(1, '', true)
            const count = await this.userService.countByName(username)
            if (count == 0) {
                session.signupInfo = { username }
                return username
            }
        }
        throw new Error('Too many user name collisions!')
    }

    async finishSignup(
        session: Express.Session,
        display_name: string,
        verifier: string,
        srp_salt: string,
        muk_salt: string,
        public_key: string,
        private_key: string,
        private_key_iv: string
    ) {

        if (!session.signupInfo)
            throw new Error('Session hasn\'t started signing in')
        const user = await this.userService.create(
            session.signupInfo.username,
            display_name,
            verifier,
            srp_salt,
            muk_salt,
            public_key,
            private_key,
            private_key_iv
        )
        session.user = { id: user.id }
        delete session.signupInfo
    }
}