import Router from 'express-promise-router'
import Container from 'typedi'
import AuthService from '../services/AuthService'
import { NewUser } from 'auth'
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation'
import * as Joi from '@hapi/joi'
import 'joi-extract-type'

const router = Router()
const validator = createValidator()
const authService = Container.get(AuthService)

router.post('/startLogin', async function (req, res) {
    const responseData = await authService.startLogin(req.session, req.body.username, req.body.clientEphemeralPublic)
    return res.json(responseData)
})

router.post('/finishLogin', async function (req, res) {
    const responseData = await authService.finishLogin(req.session, req.body.clientSessionProof)
    return res.json(responseData)
})

router.get('/startSignup', async function (req, res) {
    const responseData = await authService.startSignup(req.session)
    return res.json(responseData)
})

export const useridQuery = Joi.object({
    userid: Joi.number().integer().required()
})

const signupSchema = Joi.object({
    displayName: Joi.string().required(),
    verifier: Joi.string().hex().required(),
    srpSalt: Joi.string().hex().required(),
    mukSalt: Joi.string().hex().required(),
    publicKey: Joi.object().required(),
    privateKey: Joi.string().base64().required(),
    privateKeyIv: Joi.string().base64().required(),
})

interface SignupRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Joi.extractType<typeof signupSchema>
}

router.post('/finishSignup',
    validator.body(signupSchema),
    async function (req: ValidatedRequest<SignupRequest>, res) {
        const newUser : NewUser = {
            username: req.session.signupInfo.username,
            displayName: req.body.displayName,
            verifier: req.body.verifier,
            srpSalt: req.body.srpSalt,
            mukSalt: req.body.mukSalt,
            publicKey: req.body.publicKey,
            privateKey: req.body.privateKey,
            privateKeyIv: req.body.privateKeyIv,
        }
        const responseData = await authService.finishSignup(req.session, newUser)
        return res.json(responseData)
    }
)

router.post('/cancel', async function (req, res) {
    delete req.session
    return res.send('Authentication cancelled')
})

router.use(function hangupHandler(err: any, req: any, res: any, next: any) {
    delete req.session
    return res.status(403).send('Authentication failed')
})

export default router
