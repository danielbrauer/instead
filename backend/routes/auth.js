const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const UserModel = require('../schema/user')
const config = require('config')
const crypto = require('crypto')

const secret = config.get('Customer.jwt').get('secret');

const router = express.Router()

function createTokenForUser(user, callback) {
    return jwt.sign({email: user.email}, secret, callback)
}

router.post('/login', function (req, res, next) {
    const authenticator = passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).send('Authentication error')
        }
        if (!user) {
            return res.status(400).send('Invalid username or password')
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.status(500).send('Error logging in')
            }
            createTokenForUser(user, (error, token) => {
                if (error) return res.status(500).send('User created, but error creating token')
                return res.json({ token })
            })
        })
    })
    authenticator(req, res, next)
})

router.post('/new', function (req, res) {
    UserModel.findOne({ email: req.body.email }, 'email', (error, user) => {
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
                    email: req.body.email,
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