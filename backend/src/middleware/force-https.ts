import { RequestHandler } from 'express-serve-static-core'
import * as config from '../config/config'

const requireHTTPS: RequestHandler = function (req, res, next) {
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

export default requireHTTPS
