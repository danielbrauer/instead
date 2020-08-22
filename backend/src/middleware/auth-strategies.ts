import { Request, Response, NextFunction } from 'express-serve-static-core'

export default class AuthStrategies {
    static async authenticateSession(req: Request, res: Response, next: NextFunction) {
        const user = req.session.userId

        if (!user || req.session.loginInfo) {
            return res.status(401).send('Unauthenticated session')
        }

        req.userId = user

        return next()
    }
}
