import { Response, Request, NextFunction } from 'express'

export default function delayResponse(min: number, max: number) {

    const range = max - min
    return (req: Request, res: Response, next: NextFunction) => {
        req.startTime = Date.now()

        const send = res.send
        res.send = body => {
            const minTime = Math.floor(Math.random()*range) + min
            const scheduledFinish = req.startTime + minTime
            const now = Date.now()
            console.log(`delay-response delayed: ${minTime} actual: ${now - req.startTime}`)
            if (scheduledFinish > now)
                setTimeout(() => send.call(res, body), scheduledFinish - now)
            else
                return send.call(res, body)
        }
        next()
    }
}