import db from './database'
import config from './config'
import crypto from './crypto-promise'
import jwt from './jwt-promise'
import { Basic, Bearer } from 'permit'
import { Request, Response, NextFunction } from 'express-serve-static-core'
import { TokenPayload } from 'interfaces'

export default class AuthManager {
    static _instance: AuthManager
    jwtSecret: string
    basicPermit: Basic
    bearerPermit: Bearer

    constructor() {
        this.jwtSecret = config.jwtSecret

        this.basicPermit = new Basic({ scheme: 'RestBasic' })
        this.bearerPermit = new Bearer({ scheme: 'RestBearer' })
    }
    
	static instance(){
		if (AuthManager._instance === null || AuthManager._instance === undefined){
            AuthManager._instance = new AuthManager()
		}
		return AuthManager._instance
    }
    
    static async authenticateBasic(req: Request, res: Response, next: NextFunction) {
        // Get username and password using HTTP basic auth
        const [username, password] = AuthManager.instance().basicPermit.check(req)
    
        if (!username || !password) {
            AuthManager.instance().basicPermit.fail(res)
            return res.status(401).send('Username and password required')
        }
        // Find user and generate a session token
        const user = await db.queryOne('SELECT * FROM users WHERE username = $1', [username])
        if (!user) {
            AuthManager.instance().basicPermit.fail(res)
            return res.status(401).send('No such user')
        }
        const hash = await crypto.scrypt(password, user.salt, 64)
        if (hash.toString('base64') == user.password_hash) {
            req.user = user
            return next()
        }
        AuthManager.instance().basicPermit.fail(res)
        return res.status(401).send('Incorrect password')
    }
    
    static async authenticateBearer(req: Request, res: Response, next: NextFunction) {
        // Try to find the bearer token in the request header.
        const token = AuthManager.instance().bearerPermit.check(req)
        
        if (!token) {
            AuthManager.instance().bearerPermit.fail(res)
            return next(new Error('Token required!'))
        }
    
        // Verify token and put it in the request
        const payload = await jwt.verify(token, AuthManager.instance().jwtSecret)
        req.tokenPayload = payload as TokenPayload
        return next()
    }
}
