import Router from 'express-promise-router'
import Container from 'typedi'
import AuthService from '../services/AuthService'
import validate from '../middleware/validate'
import { delayResponse } from '../middleware/delay-response'
import { NewUser } from 'auth'

const router = Router()
const authService = Container.get(AuthService)

router.use(delayResponse)

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

router.post('/finishSignup',
    validate({
        privateKey: { in: ['body'], isBase64: true, },
        privateKeyIv: { in: ['body'], isBase64: true, },
    }),
    async function (req, res) {
        const newUser: NewUser = {
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