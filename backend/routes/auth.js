const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const UserModel = require('../schema/user')
const config = require('config')

const secret = config.get('Customer.jwt').get('secret');

const router  = express.Router()

function createTokenForUser(user) {
    return jwt.sign(user.toJSON(), secret)
}

router.post('/login', function (req, res, next) {
    const authenticator = passport.authenticate('local', {session: false}, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                message: err.message,
                user   : user
            })
        }
        if (!user) {
            console.log('no user')
            return res.status(400).json({
                message: err.message,
                user   : user
            })
        }
        req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err)
           }
           console.log(user)
           const token = createTokenForUser(user)
           return res.json({user, token})
        })
    })
    authenticator(req,res,next)
})

router.post('/new', function (req, res) {
    console.log('new user request')
    UserModel.findOne({email: req.body.email}, 'email', (error, user) => {
        console.log('query returned')
        if (error) {
            console.log('got error searching for User', error)
            return res.status(400).json({
                message: "got error searching for User"
            })
        }
        if (user) {
            console.log('exists')
            return res.status(400).json({
                message: "user exists"
            })
        }
        console.log('no user found, creating new one')
        UserModel.create({
            email: req.body.email,
            password: req.body.password,
        }, (error, user) => {
            if (error) {
                console.log('Could not create new user', error)
                return res.status(400).json({
                    message: "got error searching for User"
                })
            }
            console.log(user)
            const token = createTokenForUser(user)
            return res.json({user, token})
        })
    })
})

module.exports = router