import Router from 'express-promise-router'
import db from '../services/database'
import srp from 'secure-remote-password/server'
import { generateCombination } from '../util/animalGenerator'
import crypto from '../util/crypto-promise'
import config from '../config/config'

const router = Router()

router.post('/startLogin', async function(req, res) {
    const session = req.session
    if (session.user)
        return res.status(401).send('Session already started logging in')
    const { username, clientEphemeralPublic } = req.body
    const user = await db.queryOne(
        'SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = $1',
        [username]
    )
    if (user) {
        user.srpSalt = user.srp_salt
        user.displayName = user.display_name
        const serverEphemeral = srp.generateEphemeral(user.verifier)
        session.loginInfo = {
            user,
            clientEphemeralPublic,
            serverEphemeralSecret: serverEphemeral.secret
        }
        return res.send({
            srpSalt: user.srpSalt,
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

router.post('/finishLogin', async function(req, res) {
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
        loginInfo.user.srpSalt,
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
    const username = generateCombination(1, '', true)
    req.session.signupInfo = { username }
    return res.send({ username })
})

router.post('/finishSignup', async function (req, res) {
    const session = req.session
    if (!session.signupInfo)
        return res.status(405).send('Session hasn\'t started signing in')
    const user = await db.queryOne(
        'INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', 
        [
            session.signupInfo.username,
            req.body.displayName,
            req.body.verifier,
            req.body.srpSalt,
            req.body.mukSalt,
            req.body.publicKey,
            req.body.privateKey,
            req.body.privateKeyIv
        ]
    )
    session.user = { id: user.id }
    delete session.signupInfo
    return res.send({ user: { id: user.id} })
})

router.use(function hangupHandler(err: any, req: any, res: any, next: any) {
    delete req.session
    return res.status(403).send('Authentication failed')
})

export default router