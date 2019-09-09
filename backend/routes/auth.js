const express = require('express')
const jwt = require('jwt-promise')
const UserModel = require('../schema/user')
const config = require('config')
const crypto = require('../crypto-promise')
const authManager = require('../auth-strategies')
const uuidv1 = require('uuid/v1')
const asyncHandler = require('express-async-handler')

const secret = config.get('Customer.jwt').get('secret')

const router = express.Router()

async function createTokenForUser(user) {
    return jwt.sign({ userid: user._id }, secret)
}

router.get('/login', asyncHandler(authManager.authenticateBasic), asyncHandler(async function (req, res, next) {
    const token = await createTokenForUser(req.user)
    return res.json({ token })
}))

router.post('/new', asyncHandler(async function (req, res) {
    const existingUser = await UserModel.findOne({ username: req.body.username }, 'username').exec()
    if (existingUser)
        return res.status(400).send('User already exists')
    const buffer = await crypto.randomBytes(32)
    const salt = buffer.toString('base64')
    const hash = await crypto.scrypt(req.body.password, salt, 64)
    const user = await UserModel.create({
        _id: uuidv1(),
        username: req.body.username,
        passwordHash: hash.toString('base64'),
        salt: salt,
    })
    const token = await createTokenForUser(user)
    return res.json({ token })
}))

module.exports = router