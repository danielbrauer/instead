import { createValidator, ValidatedRequest } from 'express-joi-validation'
import Router from 'express-promise-router'
import Container from 'typedi'
import config from '../config/config'
import delayResponse from '../middleware/delay-response'
import AuthService from '../services/AuthService'
import * as Schema from './authSchema'

const router = Router()
const validator = createValidator()
const authService = Container.get(AuthService)

router.use(delayResponse(config.int('MIN_AUTH_TIME'), config.int('MAX_AUTH_TIME')))

router.post(
    '/startLogin',
    validator.query(Schema.empty),
    validator.body(Schema.startLoginBody),
    async function (req: ValidatedRequest<Schema.StartLoginRequest>, res) {
        const responseData = await authService.startLogin(
            req.session,
            req.body.username,
            req.body.clientEphemeralPublic,
        )
        return res.json(responseData)
    },
)

router.post(
    '/finishLogin',
    validator.query(Schema.empty),
    validator.body(Schema.finishLoginBody),
    async function (req: ValidatedRequest<Schema.FinishLoginRequest>, res) {
        const responseData = await authService.finishLogin(req.session, req.body.clientSessionProof)
        return res.json(responseData)
    },
)

router.put('/cancel', validator.query(Schema.empty), validator.body(Schema.empty), async function (
    req,
    res,
) {
    delete req.session
    return res.send('Authentication cancelled')
})

router.use(function hangupHandler(err: any, req: any, res: any, next: any) {
    console.log(err)
    delete req.session
    return res.status(403).send('Authentication failed')
})

export default router
