const UserModel = require('./schema/user')
const config = require('config')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { Basic, Bearer } = require('permit')

class AuthManager {
    constructor() {
        this.jwtSecret = config.get('Customer.jwt').get('secret')

        this.basicPermit = new Basic()
        this.bearerPermit = new Bearer()
    }
    
	static instance(){
		if (AuthManager._instance === null || 
			AuthManager._instance === undefined){
            AuthManager._instance = new AuthManager();
		}
		return AuthManager._instance
    }
    
    static authenticateBasic(req, res, next) {
        // Get username and password using HTTP basic auth
        const [username, password] = AuthManager.instance().basicPermit.check(req)
    
        if (!username || !password) {
            AuthManager.instance().basicPermit.fail(res)
            return next(new Error(`Username and password required!`))
        }
        // Find user and generate a session token
        return UserModel.findOne({ username: username })
            .then(user => {
                if (!user) {
                    AuthManager.instance().basicPermit.fail(res)
                    return next(new Error('No such user.'))
                }
                crypto.scrypt(password, user.salt, 64, (error, hash) => {
                    if (error) {
                        return next(new Error('Error hashing password.'))
                    }
                    if (hash.toString('base64') == user.passwordHash) {
                        req.user = user
                        return next()
                    }
                    return next(new Error('Incorrect password'))
                })
            })
            .catch(err => next(err))
    }
    
    static authenticateBearer(req, res, next) {
        // Try to find the bearer token in the request header.
        const token = AuthManager.instance().bearerPermit.check(req)
        
        if (!token) {
            AuthManager.instance().bearerPermit.fail(res)
            return next(new Error(`Token required!`))
        }
    
        // Verify token and put it in the request
        jwt.verify(token, AuthManager.instance().jwtSecret, (error, payload) => {
            if (error) {
                AuthManager.instance().bearerPermit.fail(res)
                return next(new Error(`Token invalid!`))
            }
            req.tokenPayload = payload
            return next()
        })
    }
}

module.exports = AuthManager;