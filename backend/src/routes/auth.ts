import Router from 'express-promise-router'
import db from '../database'
import srp from 'secure-remote-password/server'
import authManager from '../auth-strategies'

const router = Router()

router.post('/startLogin', async function(req, res) {
    const session = req.session
    if (session.user)
        return res.status(405).send('Session already started logging in')
    const { username, clientEphemeralPublic } = req.body
    const user = await db.queryOne(
        'SELECT id, username, salt, verifier FROM users WHERE username = $1',
        [username]
    )
    if (!user)
        return res.status(403).send('No such user')
    try {
        session.user = user
        session.clientEphemeralPublic = clientEphemeralPublic
        const serverEphemeral = srp.generateEphemeral(user.verifier)
        session.serverEphemeralSecret = serverEphemeral.secret
        return res.send({
            salt: user.salt,
            serverEphemeralPublic: serverEphemeral.public,
        })
    } catch (error) {
        return res.status(403).send('No such user')
    }
})

router.post('/finishLogin', async function(req, res) {
    const session = req.session
    if (!session.user)
        return res.status(405).send('Session hasn\'t started logging in')
    if (!session.user.salt)
        return res.status(405).send('Session already logged in')
    const { clientSessionProof } = req.body
    const serverSession = srp.deriveSession(
        session.serverEphemeralSecret,
        session.clientEphemeralPublic,
        session.user.salt,
        session.user.username,
        session.user.verifier,
        clientSessionProof
    )
    delete session.serverEphemeralSecret
    delete session.clientPublicEphemeral
    session.user = { id: session.user.id }
    return res.send({
        userid: req.session.user.id,
        serverSessionProof: serverSession.proof,
    })
})

router.post('/new', async function (req, res) {
    const username = 'james'
    const user = await db.queryOne(
        'INSERT INTO users (username, display_name, verifier, salt) VALUES ($1, $2, $3, $4) RETURNING id, username', 
        [
            username,
            req.body.displayName,
            req.body.verifier,
            req.body.salt,
        ]
    )
    req.session.user = { id: user.id }
    return res.send({ user })
})

router.get('/cancelLogin', async function (req, res) {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ message: 'Error destroying session'})
        return res.send('Session destroyed')
    })
})

export default router