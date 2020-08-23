import Router from 'express-promise-router'
import Container from 'typedi'
import AuthService from '../services/AuthService'
import { createValidator, ValidatedRequest } from 'express-joi-validation'
import * as Schema from './signupSchema'
import delayResponse from '../middleware/delay-response'
import * as config from '../config/config'

const router = Router()
const validator = createValidator()
const authService = Container.get(AuthService)

router.use(delayResponse(config.int('MIN_SIGNUP_TIME'), config.int('MAX_SIGNUP_TIME')))

router.post('/', validator.query(Schema.empty), validator.body(Schema.signupBody), async function (
    req: ValidatedRequest<Schema.SignupRequest>,
    res,
) {
    await authService.signup(req.body)
    return res.json({ success: true })
})

export default router
