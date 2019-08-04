const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('./schema/user')
const config = require('config')

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
            return UserModel.findOne({email, password})
                .then(user => {
                    if (!user) {
                        return callback(null, false, {message: 'Incorrect email or password.'})
                    }
                    return callback(null, user, {message: 'Logged In Successfully'})
                })
                .catch(err => callback(err))
        }
    )
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
        secretOrKey   : secret
    },
    function (jwtPayload, callback) {
        console.log("chekcing")
        return callback(null, true)
    }
));