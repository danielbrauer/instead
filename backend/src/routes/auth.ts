import Router from 'express-promise-router'
import db from '../database'
import crypto from '../crypto-promise'
import authManager from '../auth-strategies'

const router = Router()

router.get('/login', authManager.authenticateBasic, async function (req, res) {
    return res.send({ id: req.session.user.id })
})

router.post('/new', async function (req, res) {
    const count = await db.count(
        'SELECT COUNT(*) FROM users WHERE username = $1',
        [req.body.username]
    )
    if (count === 0)
        return res.status(400).send('User already exists')
    const buffer = await crypto.randomBytes(32)
    const salt = buffer.toString('base64')
    const hash = await crypto.scrypt(req.body.password, salt, 64)
    const user = await db.queryOne(
        'INSERT INTO users (username, password_hash, salt) VALUES ($1, $2, $3) RETURNING id', 
        [
            req.body.username,
            hash.toString('base64'),
            salt,
        ]
    )
    req.session.user = user
    return res.send({ id: req.session.user.id })
})

export default router