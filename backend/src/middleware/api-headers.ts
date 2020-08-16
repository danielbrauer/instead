import { RequestHandler } from 'express'

const setHeaders: RequestHandler = (req, res, next) => {
    res.setHeader('cache-control', 'no-transform')
    next()
}

export default setHeaders
