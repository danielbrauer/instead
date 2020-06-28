import { Container } from 'typedi'
import Router from 'express-promise-router'
import { query, body, validationResult } from 'express-validator'
import UserService from "../services/UserService"
import PostService from "../services/PostService"

const router = Router()
const userService = Container.get(UserService)
const postService = Container.get(PostService)

// get the URL where images are hosted
router.get('/getConfig', (req, res) => {
    const contentUrl = postService.getS3ContentUrl()
    const config = {
        contentUrl: contentUrl,
    }
    res.json({ success: true, config })
})

router.get('/getPosts', async (req, res) => {
    const posts = await postService.getPostsByAuthor(req.user.id)
    return res.json({ success: true, posts })
})

router.get('/getFollowRequests', async (req, res) => {
    const requests = await userService.getFollowRequests(req.user.id)
    return res.json({ success: true, requests })
})

router.get('/getFollowerIds', async (req, res) => {
    const followers = await userService.getFollowers(req.user.id)
    return res.json({ success: true, followers })
})

router.get('/getFollowees', async (req, res) => {
    const followees = await userService.getFollowees(req.user.id)
    return res.json({ success: true, followees })
})

const queryUseridValidator = query('userid').isInt().toInt()

router.get('/getUserById', queryUseridValidator, async (req, res) => {
    const user = await userService.getUserById(req.query.userid)
    return res.json({ success: true, user: user })
})

const bodyUsernameValidator = body('username').isString()

router.post('/sendFollowRequest', bodyUsernameValidator, async (req, res) => {
    await userService.addFollowRequest(req.user.id, req.body.username)
    return res.json({ success: true })
})

const bodyUseridValidator = body('userid').isInt().toInt()

router.post('/rejectFollowRequest', bodyUseridValidator, async (req, res) => {
    await userService.removeFollowRequest(req.body.userid, req.user.id)
    return res.json({ success: true })
})

router.post('/unfollow', bodyUseridValidator, async (req, res) => {
    await userService.removeFollower(req.user.id, req.body.userid)
    return res.json({ success: true })
})

router.post('/removeFollower', bodyUseridValidator, async (req, res) => {
    await userService.removeFollower(req.body.userid, req.user.id)
    return res.json({ success: true })
})

router.post('/acceptFollowRequest', bodyUseridValidator, async (req, res) => {
    await userService.acceptFollowRequest(req.body.userid, req.user.id)
    return res.json({ success: true })
})

const queryIdValidator = query('id').isInt().toInt()
// removes existing data in our database, and
// deletes the associated s3 object
router.delete('/deletePost', queryIdValidator, async (req, res) => {
    await postService.deletePost(parseInt(req.query.id as string), req.user.id)
    return res.json({ success: true })
})

// get URL for uploading
router.post(
    '/createPost',
    body('fileType').equals('application/octet-stream'),
    async (req, res) => {
        const data = await postService.createPost(req.user.id, req.body.iv, req.body.key, req.body.fileType)
        return res.json({ success: true, data })
    }
)

router.get('/logout', async function (req, res) {
    req.session.destroy(err => {
        if (err)
            res.status(500).send('Could not end session')
        else
            res.send('Logged out')
    })
})

export default router