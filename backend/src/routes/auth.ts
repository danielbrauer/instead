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
        'SELECT id, username, salt, verifier FROM users WHERE username = $1',
        [username]
    )
    if (!user)
        return res.status(403).send('No such user')
    try {
        const serverEphemeral = srp.generateEphemeral(user.verifier)
        session.loginInfo = {
            user,
            clientEphemeralPublic,
            serverEphemeralSecret: serverEphemeral.secret
        }
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
    if (!session.loginInfo)
        return res.status(405).send('Session hasn\'t started logging in')
    const { clientSessionProof } = req.body
    const loginInfo = session.loginInfo
    const serverSession = srp.deriveSession(
        loginInfo.serverEphemeralSecret,
        loginInfo.clientEphemeralPublic,
        loginInfo.user.salt,
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
        'INSERT INTO users (username, display_name, verifier, salt) VALUES ($1, $2, $3, $4) RETURNING id', 
        [
            session.signupInfo.username,
            req.body.displayName,
            req.body.verifier,
            req.body.salt,
        ]
    )
    session.user = { id: user.id }
    delete session.signupInfo
    return res.send({ user: { id: user.id} })
})

router.get('/cancelLogin', async function (req, res) {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ message: 'Error destroying session'})
        return res.send('Session destroyed')
    })
})

export default router