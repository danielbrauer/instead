import Router from 'express-promise-router'
import db from '../database'
import srp from 'secure-remote-password/server'
import { generateCombination } from '../util/animalGenerator'

const router = Router()

router.post('/startLogin', async function(req, res) {
    const session = req.session
    if (session.user)
        return res.status(405).send('Session already started logging in')
    const { username, clientEphemeralPublic } = req.body
    const user = await db.queryOne(
        'SELECT id, username, srp_salt, verifier FROM users WHERE username = $1',
        [username]
    )
    if (!user)
        return res.status(403).send('No such user')
    user.srpSalt = user.srp_salt
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
})

router.post('/finishLogin', async function(req, res) {
    const session = req.session
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
        'INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', 
        [
            session.signupInfo.username,
            req.body.displayName,
            req.body.verifier,
            req.body.srpSalt,
            req.body.mukSalt,
            req.body.publicKey,
            req.body.privateKey,
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