import db from './database'
import crypto from './crypto-promise'
import { Basic, Permit } from 'permit'
import { Request, Response, NextFunction } from 'express-serve-static-core'

export default class AuthManager {
    static _instance: AuthManager
    basicPermit: Basic
    sessionPermit: Permit

    constructor() {
        this.basicPermit = new Basic({ scheme: 'RestBasic' })
        this.sessionPermit = new Permit({ scheme: 'RestSession' })
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
            req.session.user = user
            return next()
        }
        AuthManager.instance().basicPermit.fail(res)
        return res.status(401).send('Incorrect password')
    }
    
    static async authenticateSession(req: Request, res: Response, next: NextFunction) {

        const user = req.session.user
        
        if (!user) {
            AuthManager.instance().sessionPermit.fail(res)
            return next(new Error('Unauthenticated session!'))
        }

        req.user = user

        return next()
    }
}
