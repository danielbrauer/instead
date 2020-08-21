import { Container } from 'typedi'
import Router from 'express-promise-router'
import UserService from '../services/UserService'
import PostService from '../services/PostService'
import KeyService from '../services/KeyService'
import { ServerError } from '../middleware/errors'
import { ValidatedRequest, createValidator } from 'express-joi-validation'
import * as Schema from './apiSchema'

const router = Router()
const validator = createValidator()
const userService = Container.get(UserService)
const postService = Container.get(PostService)
const keyService = Container.get(KeyService)

router.put(
    '/logout',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        req.session.destroy((err) => {
            if (err) res.status(500).send('Could not end session')
            else res.send('Logged out')
        })
    },
)

router.get(
    '/getContentUrl',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const contentUrl = postService.getContentUrl()
        res.json(contentUrl)
    },
)

router.get(
    '/getHomePosts',
    validator.query(Schema.getHomePostsQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.GetHomePostsRequest>, res) => {
        const posts = await postService.getHomePosts(req.user.id, req.query.pageIndex)
        return res.json(posts)
    },
)

router.get(
    '/getUserPosts',
    validator.query(Schema.getUserPostsQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.GetUserPostsRequest>, res) => {
        const posts = await postService.getUserPosts(
            req.query.userId,
            req.user.id,
            req.query.pageIndex,
        )
        return res.json(posts)
    },
)

router.get(
    '/getPost',
    validator.query(Schema.postByIdQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.PostByIdRequest>, res) => {
        const post = await postService.getPost(req.query.id, req.user.id)
        return res.json(post)
    },
)

router.get(
    '/getComments',
    validator.query(Schema.postByIdQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.PostByIdRequest>, res) => {
        const comments = await postService.getCommentsForPost(req.query.id, req.user.id)
        return res.json(comments)
    },
)

router.post(
    '/createComment',
    validator.query(Schema.empty),
    validator.body(Schema.createCommentBody),
    async (req: ValidatedRequest<Schema.CreateCommentRequest>, res) => {
        const result = await postService.addCommentToPost({ authorId: req.user.id, ...req.body })
        return res.json(result)
    },
)

router.delete(
    '/deletePost',
    validator.query(Schema.postByIdQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.PostByIdRequest>, res) => {
        const result = await postService.deletePost(req.query.id, req.user.id)
        return res.json(result)
    },
)

router.get(
    '/getCurrentKey',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const currentKey = await keyService.getCurrentKey(req.user.id)
        return res.json(currentKey)
    },
)

router.post(
    '/createCurrentKey',
    validator.query(Schema.empty),
    validator.body(Schema.createCurrentKeyBody),
    async (req: ValidatedRequest<Schema.CreateCurrentKeyRequest>, res) => {
        const keySetId = await keyService.createKeySet(req.user.id, req.body.key)
        return res.json(keySetId)
    },
)

router.get(
    '/getKey',
    validator.query(Schema.getKeyQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.GetKeyRequest>, res) => {
        const key = await keyService.getKey(req.user.id, req.query.keySetId)
        return res.json(key)
    },
)

router.get(
    '/getAllKeys',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const keys = await keyService.getAllKeys(req.user.id)
        return res.json(keys)
    },
)

router.put(
    '/addKeys',
    validator.query(Schema.empty),
    validator.body(Schema.addKeysBody),
    async (req: ValidatedRequest<Schema.AddKeysRequest>, res) => {
        keyService.addKeys(req.body.keys)
        return res.json({ success: true })
    },
)

router.get(
    '/getPublicKey',
    validator.query(Schema.getByUserIdQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.GetByUserIdRequest>, res) => {
        const key = await keyService.getPublicKey(req.query.userId)
        if (key === null) throw new ServerError('User does not exist')
        return res.json(key)
    },
)

router.get(
    '/getFollowerPublicKeys',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const keys = await keyService.getFollowerPublicKeys(req.user.id)
        return res.json(keys)
    },
)

router.post(
    '/startPost',
    validator.query(Schema.empty),
    validator.body(Schema.startPostBody),
    async (req: ValidatedRequest<Schema.StartPostRequest>, res) => {
        const currentKey = await keyService.getCurrentKey(req.user.id)
        if (currentKey == null) throw new ServerError('No current key')
        if (currentKey.keySetId !== req.body.keySetId)
            throw new ServerError('Post key does not match current key')
        const postInfo = await postService.createPost(
            req.user.id,
            req.body.keySetId,
            req.body.iv,
            req.body.md5,
            req.body.aspect,
        )
        return res.json(postInfo)
    },
)

router.put(
    '/finishPost',
    validator.query(Schema.empty),
    validator.body(Schema.finishPostBody),
    async (req: ValidatedRequest<Schema.FinishPostRequest>, res) => {
        if (req.body.success) {
            await postService.publishPost(req.body.postId)
        } else {
            await postService.deletePost(req.body.postId, req.user.id)
        }
        return res.json({ success: true })
    },
)

router.get(
    '/getUserById',
    validator.query(Schema.getByUserIdQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.GetByUserIdRequest>, res) => {
        const user = await userService.getUserById(req.query.userId)
        return res.json(user)
    },
)

router.put(
    '/sendFollowRequest',
    validator.query(Schema.empty),
    validator.body(Schema.sendFollowRequestBody),
    async (req: ValidatedRequest<Schema.SendFollowRequestRequest>, res) => {
        await userService.addFollowRequestByCode(req.user.id, req.body.friendCode)
        return res.send('Sent request!')
    },
)

router.put(
    '/sendFollowRequestDirect',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.addFollowRequestById(req.user.id, req.body.userId)
        return res.send('Sent request!')
    },
)

router.put(
    '/rejectFollowRequest',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.removeFollowRequest(req.body.userId, req.user.id)
        return res.json({ success: true })
    },
)

router.put(
    '/unfollow',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.removeFollower(req.user.id, req.body.userId)
        return res.json({ success: true })
    },
)

router.put(
    '/removeFollower',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.removeFollower(req.body.userId, req.user.id)
        return res.json({ success: true })
    },
)

router.put(
    '/acceptFollowRequest',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.acceptFollowRequest(req.body.userId, req.user.id)
        return res.json({ success: true })
    },
)

router.get(
    '/getFollowRequests',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const requests = await userService.getFollowRequests(req.user.id)
        return res.json(requests)
    },
)

router.get(
    '/getSentFollowRequests',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const requests = await userService.getSentFollowRequests(req.user.id)
        return res.json(requests)
    },
)

router.get(
    '/getFollowerIds',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const followers = await userService.getFollowers(req.user.id)
        return res.json(followers)
    },
)

router.get(
    '/getFollowees',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const followees = await userService.getFollowees(req.user.id)
        return res.json(followees)
    },
)

router.post(
    '/regenerateFriendCode',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const code = await userService.regenerateFriendCode(req.user.id)
        return res.json(code)
    },
)

export default router
