import { RequestHandler } from 'express'

const authenticateSession: RequestHandler = (req, res, next) => {
    const user = req.session.userId

    if (!user || req.session.loginInfo) {
        return res.status(401).send('Unauthenticated session')
    }

    req.userId = user

    return next()
}

export default authenticateSession
