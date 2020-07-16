import { Container } from 'typedi'
import Router from 'express-promise-router'
import validate from '../middleware/validate'
import UserService from '../services/UserService'
import PostService from '../services/PostService'
import KeyService from '../services/KeyService'
import { ServerError } from '../middleware/errors'

const router = Router()
const userService = Container.get(UserService)
const postService = Container.get(PostService)
const keyService = Container.get(KeyService)

router.get('/logout', async function (req, res) {
    req.session.destroy(err => {
        if (err)
            res.status(500).send('Could not end session')
        else
            res.send('Logged out')
    })
})

router.get('/getContentUrl', (req, res) => {
    const contentUrl = postService.getContentUrl()
    res.json(contentUrl)
})

router.get('/getPosts', async (req, res) => {
    const posts = await postService.getPostsByAuthor(req.user.id)
    return res.json(posts)
})

router.delete(
    '/deletePost',
    validate({
        id: { in: ['query'], isInt: true, toInt: true, }
    }),
    async (req, res) => {
        const result = await postService.deletePost(req.query.id as unknown as number, req.user.id)
        return res.json(result)
    }
)

router.get('/getCurrentKey', async (req, res) => {
    const currentKey = await keyService.getCurrentKey(req.user.id)
    return res.json(currentKey)
})

router.post('/createCurrentKey',
    validate({
        jwk: { in: ['body'], isBase64: true },
    }),
    async (req, res) => {
        const keySetId = keyService.createKeySet(req.user.id, req.body.jwk)
        return res.json(keySetId)
    }
)

router.post('/addKeys', async (req, res) => {
    keyService.addKeys(req.body.keys)
    return res.json({ success: true})
})

router.post(
    '/startPost',
    validate({
        keyId: { in: ['body'], isInt: true, toInt: true, },
        iv: { in: ['body'], isBase64: true },
        md5: { in: ['body'], isBase64: true },
    }),
    async (req, res) => {
        const currentKey = await keyService.getCurrentKeySetId(req.user.id)
        if (currentKey == null)
            throw new ServerError('No current key')
        if (currentKey !== req.body.keyId)
            throw new ServerError('Post key does not match current key')
        const postInfo = await postService.createPost(req.user.id, req.body.keyId, req.body.iv, req.body.md5)
        return res.json(postInfo)
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

router.get(
    '/getUserById',
    validate({
        userid: { in: ['query'], isInt: true, toInt: true}
    }),
    async (req, res) => {
        const user = await userService.getUserById(req.query.userid as unknown as number)
        return res.json(user)
    }
)

router.post(
    '/sendFollowRequest',
    validate({
        username: { in: ['body'], isAlpha: true }
    }),
    async (req, res) => {
        await userService.addFollowRequest(req.user.id, req.body.username)
        return res.send(`Sent request to ${req.body.username}`)
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

router.get('/getFollowRequests', async (req, res) => {
    const requests = await userService.getFollowRequests(req.user.id)
    return res.json(requests)
})

router.get('/getFollowerIds', async (req, res) => {
    const followers = await userService.getFollowers(req.user.id)
    return res.json(followers)
})

router.get('/getFollowerPublicKeys', async (req, res) => {
    const keys = await keyService.getFollowerPublicKeys(req.user.id)
    return res.json(keys)
})

router.get('/getFollowees', async (req, res) => {
    const followees = await userService.getFollowees(req.user.id)
    return res.json(followees)
})

export default router