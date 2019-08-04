const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const router  = express.Router()

router.post('/login', function (req, res, next) {
    const authenticator = passport.authenticate('local', {session: false}, (err, user, info) => {
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
           // generate a signed JWT with the contents of user object and return it in the response
           const token = jwt.sign(user, 'your_jwt_secret')
           return res.json({user, token})
        })
    })
    authenticator(req,res,next)
})

module.exports = router