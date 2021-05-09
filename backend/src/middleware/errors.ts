import { ErrorRequestHandler } from 'express'
import config from '../config/config'

export class ServerError extends Error {
    clientVisible: boolean
    constructor(message: string) {
        super()
        this.clientVisible = true
        this.message = message
    }
}

const forwardErrors: ErrorRequestHandler = function (err, req, res, next) {
    if (config.isLocalDev()) console.log(err)
    if (err instanceof ServerError) {
        const serverError = err as ServerError
        if (serverError.clientVisible) return res.status(400).send(serverError.message)
    }
    return res.status(500).send('Internal server error')
}

export default forwardErrors
