const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('./schema/user')
const config = require('config')
const crypto = require('crypto')

const secret = config.get('Customer.jwt').get('secret');

const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, 
        function (email, password, callback) {
            return UserModel.findOne({email})
                .then(user => {
                    if (!user) {
                        return callback(null, false, {message: 'No such user.'})
                    }
                    crypto.scrypt(password, user.salt, 64, (error, hash) => {
                        if (error) {
                            return callback(error, false, {message: 'Error hashing password.'})
                        }
                        if (hash.toString('base64') == user.passwordHash) {
                            return callback(null, user, {message: 'Logged In Successfully'})
                        }
                        return callback(null, false, {message: 'Incorrect password'})
                    })
                })
                .catch(err => callback(err))
        }
    )
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : secret
    },
    function (jwtPayload, callback) {
        return callback(null, true)
    }
));