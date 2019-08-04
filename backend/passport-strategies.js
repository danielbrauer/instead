const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('./schema/user')

const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, 
        function (email, password, callback) {
            console.log("passport")
            //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
            // return UserModel.findOne({email, password})
            //     .then(user => {
            //         if (!user) {
            //             return callback(null, false, {message: 'Incorrect email or password.'})
            //         }
            //         return callback(null, user, {message: 'Logged In Successfully'})
            //     })
            //     .catch(err => callback(err))
            return callback(null, {username:"none"}, {message: 'Logged In Successfully'})
        }
    )
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    function (jwtPayload, callback) {
        // find the user in db if needed.
        // This functionality may be omitted if you store everything you'll need in JWT payload.
        return UserModel.findOneById(jwtPayload.id)
            .then(user => {
                return callback(null, user);
            })
            .catch(err => {
                return callback(err);
            });
    }
));