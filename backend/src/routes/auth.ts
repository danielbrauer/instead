import Router from 'express-promise-router'
import Container from 'typedi'
import AuthService from '../services/AuthService'

const router = Router()
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

router.post('/finishSignup', async function (req, res) {
    const responseData = await authService.finishSignup(
        req.session,
        req.body.displayName,
        req.body.verifier,
        req.body.srpSalt,
        req.body.mukSalt,
        req.body.publicKey,
        req.body.privateKey,
        req.body.privateKeyIv
    )
    return res.json(responseData)
})

router.use(function hangupHandler(err: any, req: any, res: any, next: any) {
    delete req.session
    return res.status(403).send('Authentication failed')
})

export default router