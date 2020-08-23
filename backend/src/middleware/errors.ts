import { Response, Request, NextFunction } from 'express'

export class ServerError extends Error {
    clientVisible: boolean
    constructor(message: string) {
        super()
        this.clientVisible = true
        this.message = message
    }
}

export default function forwardErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ServerError) {
        const serverError = err as ServerError
        if (serverError.clientVisible) return res.status(400).send(serverError.message)
    }
    return res.status(500).send('Internal server error')
}
