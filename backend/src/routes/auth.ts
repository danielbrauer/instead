import Router from 'express-promise-router'
import db from '../services/database'
import srp from 'secure-remote-password/server'
import { generateCombination } from '../util/animalGenerator'
import crypto from '../util/crypto-promise'
import config from '../config/config'
import * as Users from '../queries/users.gen'

const router = Router()

router.post('/startLogin', async function (req, res) {
    const session = req.session
    if (session.user)
        return res.status(401).send('Session already started logging in')
    const { username, clientEphemeralPublic } = req.body
    const [user] = await Users.getLoginInfoByName.run(
        { username },
        db
    )
    if (user) {
        const serverEphemeral = srp.generateEphemeral(user.verifier)
        session.loginInfo = {
            user,
            clientEphemeralPublic,
            serverEphemeralSecret: serverEphemeral.secret
        }
        return res.send({
            srpSalt: user.srp_salt,
            serverEphemeralPublic: serverEphemeral.public,
        })
    } else {
        const bytes = await crypto.randomBytes(256)
        const hash = crypto.createHash('sha256').update(username).update(config.garbageSeed)
        session.loginFake = true
        return res.send({
            srpSalt: hash.digest('hex').substring(32),
            serverEphemeralPublic: bytes.toString('hex'),
        })
    }
})

router.post('/finishLogin', async function (req, res) {
    const session = req.session
    if (session.loginFake)
        throw new Error('No such user')
    if (!session.loginInfo)
        throw new Error('Missing info from startLogin')
    const { clientSessionProof } = req.body
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
    return res.send({
        userid: session.user.id,
        serverSessionProof: serverSession.proof,
        displayName: session.user.displayName,
    })
})

router.get('/startSignup', async function (req, res) {
    let username = ''
    for (let i = 0; i < 5; ++i) {
        username = generateCombination(1, '', true)
        const [{count}] = await Users.countByName.run(
            { username },
            db
        )
        if (count == 0) {
            req.session.signupInfo = { username }
            return res.send({ username })
        }
    }
    throw new Error('Too many user name collisions!')
})

router.post('/finishSignup', async function (req, res) {
    const session = req.session
    if (!session.signupInfo)
        return res.status(405).send('Session hasn\'t started signing in')
    const [user] = await Users.create.run(
        {
            username: session.signupInfo.username,
            display_name: req.body.displayName,
            verifier: req.body.verifier,
            srp_salt: req.body.srpSalt,
            muk_salt: req.body.mukSalt,
            public_key: req.body.publicKey,
            private_key: req.body.privateKey,
            private_key_iv: req.body.privateKeyIv
        },
        db
    )
    session.user = { id: user.id }
    delete session.signupInfo
    return res.send({ user: { id: user.id } })
})

router.use(function hangupHandler(err: any, req: any, res: any, next: any) {
    delete req.session
    return res.status(403).send('Authentication failed')
})

export default router