import * as config from '../config/config'
import { Request, Response, NextFunction } from 'express-serve-static-core'

export default function requireHTTPS(req: Request, res: Response, next: NextFunction) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!config.isLocalDev() && !req.secure && req.get('x-forwarded-proto') !== 'https') {
        if (req.method === 'GET') {
            return res.redirect('https://' + req.get('host') + req.url)
        } else {
            return res.status(403).send('HTTPS only')
        }
    }
    next()
}