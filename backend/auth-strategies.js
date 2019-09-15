const db = require('./database')
const config = require('config')
const crypto = require('./crypto-promise')

const jwt = require('jwt-promise')
const Basic = require('permit').Basic
const Bearer = require('permit').Bearer

class AuthManager {
    constructor() {
        this.jwtSecret = config.get('Customer.jwt').get('secret')

        this.basicPermit = new Basic()
        this.bearerPermit = new Bearer()
    }
    
	static instance(){
		if (AuthManager._instance === null || AuthManager._instance === undefined){
            AuthManager._instance = new AuthManager()
		}
		return AuthManager._instance
    }
    
    static async authenticateBasic(req, res, next) {
        // Get username and password using HTTP basic auth
        const [username, password] = AuthManager.instance().basicPermit.check(req)
    
        if (!username || !password) {
            AuthManager.instance().basicPermit.fail(res)
            return res.status(401).send(`Username and password required`)
        }
        // Find user and generate a session token
        const user = await db.queryOne('SELECT * FROM users WHERE username = $1', [username])
        if (!user) {
            AuthManager.instance().basicPermit.fail(res)
            return res.status(401).send(`No such user`)
        }
        const hash = await crypto.scrypt(password, user.salt, 64)
        if (hash.toString('base64') == user.password_hash) {
            req.user = user
            return next()
        }
        AuthManager.instance().basicPermit.fail(res)
        return res.status(401).send('Incorrect password')
    }
    
    static async authenticateBearer(req, res, next) {
        // Try to find the bearer token in the request header.
        const token = AuthManager.instance().bearerPermit.check(req)
        
        if (!token) {
            AuthManager.instance().bearerPermit.fail(res)
            return next(new Error(`Token required!`))
        }
    
        // Verify token and put it in the request
        const payload = await jwt.verify(token, AuthManager.instance().jwtSecret)
        req.tokenPayload = payload
        return next()
    }
}

module.exports = AuthManager