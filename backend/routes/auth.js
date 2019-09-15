const Router = require('express-promise-router')
const db = require('../database')
const jwt = require('jwt-promise')
const config = require('config')
const crypto = require('../crypto-promise')
const authManager = require('../auth-strategies')

const secret = config.get('Customer.jwt').get('secret')

const router = new Router()

async function createTokenForUser(user) {
    return jwt.sign({ userid: user.id }, secret)
}

router.get('/login', authManager.authenticateBasic, async function (req, res) {
    const token = await createTokenForUser(req.user)
    return res.json({ token })
})

router.post('/new', async function (req, res) {
    const { rowCount } = await db.query(
        'SELECT COUNT(*) FROM users WHERE username = $1',
        [req.body.username]
    )
    if (rowCount === 0)
        return res.status(400).send('User already exists')
    const buffer = await crypto.randomBytes(32)
    const salt = buffer.toString('base64')
    const hash = await crypto.scrypt(req.body.password, salt, 64)
    const { rows } = await db.query(
        'INSERT INTO users (username, password_hash, salt) VALUES ($1, $2, $3) RETURNING id', 
        [
            req.body.username,
            hash.toString('base64'),
            salt,
        ]
    )
    const token = await createTokenForUser(rows[0])
    return res.json({ token })
})

module.exports = router