const express = require('express')
const jwt = require('jsonwebtoken')
const UserModel = require('../schema/user')
const config = require('config')
const crypto = require('crypto')
const authManager = require('../auth-strategies')

const secret = config.get('Customer.jwt').get('secret');

const router = express.Router()

function createTokenForUser(user, callback) {
    return jwt.sign({username: user.username}, secret, callback)
}

router.get('/login', authManager.authenticateBasic, function (req, res, next) {
    createTokenForUser(req.user, (error, token) => {
        if (error) return res.status(500).send('User created, but error creating token')
        return res.json({ token })
    })
})

router.post('/new', function (req, res) {
    UserModel.findOne({ username: req.body.username }, 'username', (error, user) => {
        if (error) {
            return res.status(500).send('Error searching for user')
        }
        if (user) {
            return res.status(400).send('User already exists')
        }

        crypto.randomBytes(32, (error, buffer) => {
            if (error) {
                return res.status(500).send('Error generating salt')
            }
            const salt = buffer.toString('base64')
            crypto.scrypt(req.body.password, salt, 64, (error, hash) => {
                if (error) {
                    return res.status(500).send('Error hashing password')
                }

                UserModel.create({
                    username: req.body.username,
                    passwordHash: hash.toString('base64'),
                    salt: salt
                }, (error, user) => {
                    if (error) {
                        return res.status(500).send('Error creating new user')
                    }
                    createTokenForUser(user, (error, token) => {
                        if (error) return res.status(500).send('User created, but error creating token')
                        return res.json({ token })
                    })

                })
            })
        })
    })
})

module.exports = router