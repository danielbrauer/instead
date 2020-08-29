import { ErrorRequestHandler } from 'express'

export class ServerError extends Error {
    clientVisible: boolean
    constructor(message: string) {
        super()
        this.clientVisible = true
        this.message = message
    }
}

const forwardErrors: ErrorRequestHandler = function (err, req, res, next) {
    if (err instanceof ServerError) {
        const serverError = err as ServerError
        if (serverError.clientVisible) return res.status(400).send(serverError.message)
    }
    return res.status(500).send('Internal server error')
}

export default forwardErrors
