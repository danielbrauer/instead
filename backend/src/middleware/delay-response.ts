import { RequestHandler } from 'express'

export default function delayResponse(min: number, max: number) {
    const range = max - min
    const delay: RequestHandler = function (req, res, next) {
        req.startTime = Date.now()

        const send = res.send
        res.send = (body) => {
            const delay = Math.floor(Math.random() * range) + min
            const scheduledFinish = req.startTime + delay
            const now = Date.now()
            if (scheduledFinish > now) setTimeout(() => send.call(res, body), scheduledFinish - now)
            else return send.call(res, body)
        }
        next()
    }
    return delay
}
