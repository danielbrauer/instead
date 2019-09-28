import db from './database'
import srp from 'secure-remote-password/server'
import { Request, Response, NextFunction } from 'express-serve-static-core'

export default class AuthManager {
    
    static async authenticateSession(req: Request, res: Response, next: NextFunction) {

        const user = req.session.user
        
        if (!user || user.salt) {
            return next(new Error('Unauthenticated session!'))
        }

        req.user = user

        return next()
    }
}
