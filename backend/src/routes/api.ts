import { Container } from 'typedi'
import Router from 'express-promise-router'
import validate from '../middleware/validate'
import UserService from "../services/UserService"
import PostService from "../services/PostService"

const router = Router()
const userService = Container.get(UserService)
const postService = Container.get(PostService)

// get the URL where images are hosted
router.get('/getConfig', (req, res) => {
    const contentUrl = postService.getContentUrl()
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

router.get(
    '/getUserById',
    validate({
        userid: { in: ['query'], isInt: true, toInt: true}
    }),
    async (req, res) => {
        const user = await userService.getUserById(req.query.userid as unknown as number)
        return res.json({ success: true, user: user })
    }
)

router.post(
    '/sendFollowRequest',
    validate({
        username: { in: ['body'], isAlpha: true }
    }),
    async (req, res) => {
        await userService.addFollowRequest(req.user.id, req.body.username)
        return res.json({ success: true })
    }
)

router.post(
    '/rejectFollowRequest',
    validate({
        userid: { in: ['body'], isInt: true, toInt: true, }
    }),
    async (req, res) => {
        await userService.removeFollowRequest(req.body.userid, req.user.id)
        return res.json({ success: true })
    }
)

router.post(
    '/unfollow',
    validate({
        userid: { in: ['body'], isInt: true, toInt: true, }
    }),
    async (req, res) => {
        await userService.removeFollower(req.user.id, req.body.userid)
        return res.json({ success: true })
    }
)

router.post(
    '/removeFollower',
    validate({
        userid: { in: ['body'], isInt: true, toInt: true, }
    }),
    async (req, res) => {
        await userService.removeFollower(req.body.userid, req.user.id)
        return res.json({ success: true })
    }
)

router.post(
    '/acceptFollowRequest',
    validate({
        userid: { in: ['body'], isInt: true, toInt: true, }
    }),
    async (req, res) => {
        await userService.acceptFollowRequest(req.body.userid, req.user.id)
        return res.json({ success: true })
    }
)

router.delete(
    '/deletePost',
    validate({
        id: { in: ['query'], isInt: true, toInt: true, }
    }),
    async (req, res) => {
        await postService.deletePost(req.query.id as unknown as number, req.user.id)
        return res.json({ success: true })
    }
)

router.post(
    '/startPost',
    validate({
        iv: { in: ['body'], isBase64: true },
        md5: { in: ['body'], isBase64: true }
    }),
    async (req, res) => {
        const postInfo = await postService.createPost(req.user.id, req.body.iv, req.body.key, req.body.md5)
        return res.json({ success: true, ...postInfo })
    }
)

router.post(
    '/finishPost',
    validate({
        success: { in: ['body'], isBoolean: true, toBoolean: true },
        postId: { in: ['body'], isInt: true, toInt: true },
    }),
    async (req, res) => {
        if (req.body.success) {
            await postService.publishPost(req.body.postId)
        } else {
            await postService.deletePost(req.body.postId, req.user.id)
        }
        return res.json({ success: true})
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