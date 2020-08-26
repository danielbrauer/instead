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
        const posts = await postService.getHomePosts(req.userId, req.query.pageIndex)
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
            req.userId,
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
        const post = await postService.getPost(req.query.id, req.userId)
        return res.json(post)
    },
)

router.get(
    '/getComments',
    validator.query(Schema.postByIdQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.PostByIdRequest>, res) => {
        const comments = await postService.getCommentsForPost(req.query.id, req.userId)
        return res.json(comments)
    },
)

router.post(
    '/createComment',
    validator.query(Schema.empty),
    validator.body(Schema.createCommentBody),
    async (req: ValidatedRequest<Schema.CreateCommentRequest>, res) => {
        const result = await postService.addCommentToPost({ authorId: req.userId, ...req.body })
        return res.json(result)
    },
)

router.delete(
    '/deletePost',
    validator.query(Schema.postByIdQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.PostByIdRequest>, res) => {
        const result = await postService.deletePost(req.query.id, req.userId)
        return res.json(result)
    },
)

router.get(
    '/getCurrentPostKey',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const currentKey = await keyService.getCurrentPostKey(req.userId)
        return res.json(currentKey)
    },
)

router.post(
    '/createCurrentPostKey',
    validator.query(Schema.empty),
    validator.body(Schema.createCurrentKeyBody),
    async (req: ValidatedRequest<Schema.CreateCurrentKeyRequest>, res) => {
        const keySetId = await keyService.createCurrentPostKeySet(req.userId, req.body.key)
        return res.json(keySetId)
    },
)

router.get(
    '/getPostKey',
    validator.query(Schema.getKeyQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.GetKeyRequest>, res) => {
        const key = await keyService.getPostKey(req.userId, req.query.keySetId)
        return res.json(key)
    },
)

router.get(
    '/getAllPostKeys',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const keys = await keyService.getAllPostKeys(req.userId)
        return res.json(keys)
    },
)

router.put(
    '/addNewPostKeyForFollowers',
    validator.query(Schema.empty),
    validator.body(Schema.addPostKeysBody),
    async (req: ValidatedRequest<Schema.AddPostKeysRequest>, res) => {
        await keyService.addNewPostKeyForFollowers(req.userId, req.body.keys)
        return res.json({ success: true })
    },
)

router.put(
    '/addOldPostKeysForFollower',
    validator.query(Schema.empty),
    validator.body(Schema.addPostKeysBody),
    async (req: ValidatedRequest<Schema.AddPostKeysRequest>, res) => {
        await keyService.addOldPostKeysForFollower(req.userId, req.body.keys)
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
        const keys = await keyService.getFollowerPublicKeys(req.userId)
        return res.json(keys)
    },
)

router.post(
    '/startPost',
    validator.query(Schema.empty),
    validator.body(Schema.startPostBody),
    async (req: ValidatedRequest<Schema.StartPostRequest>, res) => {
        const currentKey = await keyService.getCurrentPostKey(req.userId)
        if (currentKey == null) throw new ServerError('No current key')
        if (currentKey.postKeySetId !== req.body.postKeySetId)
            throw new ServerError('Post key does not match current key')
        const postInfo = await postService.createPost(
            req.userId,
            req.body.postKeySetId,
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
            await postService.deletePost(req.body.postId, req.userId)
        }
        return res.json({ success: true })
    },
)

router.get(
    '/getUserProfile',
    validator.query(Schema.getByUserIdQuery),
    validator.body(Schema.empty),
    async (req: ValidatedRequest<Schema.GetByUserIdRequest>, res) => {
        const user = await userService.getUserProfileWithKey(req.query.userId, req.userId)
        return res.json(user)
    },
)

router.put(
    '/setProfile',
    validator.query(Schema.empty),
    validator.body(Schema.setProfileBody),
    async (req: ValidatedRequest<Schema.SetProfileRequest>, res) => {
        await userService.setProfile(req.userId, req.body.displayName, req.body.displayNameIv)
        return res.json({ success: true })
    },
)

router.put(
    '/sendFollowRequest',
    validator.query(Schema.empty),
    validator.body(Schema.sendFollowRequestBody),
    async (req: ValidatedRequest<Schema.SendFollowRequestRequest>, res) => {
        await userService.addFollowRequestByCode(req.userId, req.body.friendCode)
        return res.send('Sent request!')
    },
)

router.put(
    '/sendFollowRequestDirect',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.addFollowRequestById(req.userId, req.body.userId)
        return res.send('Sent request!')
    },
)

router.put(
    '/rejectFollowRequest',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.removeFollowRequest(req.body.userId, req.userId)
        return res.json({ success: true })
    },
)

router.put(
    '/unfollow',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.removeFollower(req.userId, req.body.userId)
        return res.json({ success: true })
    },
)

router.put(
    '/removeFollower',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.removeFollower(req.body.userId, req.userId)
        return res.json({ success: true })
    },
)

router.put(
    '/acceptFollowRequest',
    validator.query(Schema.empty),
    validator.body(Schema.putByUserIdBody),
    async (req: ValidatedRequest<Schema.PutByUserIdRequest>, res) => {
        await userService.acceptFollowRequest(req.body.userId, req.userId)
        return res.json({ success: true })
    },
)

router.get(
    '/getFollowRequests',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const requests = await userService.getFollowRequests(req.userId)
        return res.json(requests)
    },
)

router.get(
    '/getSentFollowRequests',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const requests = await userService.getSentFollowRequests(req.userId)
        return res.json(requests)
    },
)

router.get(
    '/getFollowerIds',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const followers = await userService.getFollowers(req.userId)
        return res.json(followers)
    },
)

router.get(
    '/getFollowees',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const followees = await userService.getFollowees(req.userId)
        return res.json(followees)
    },
)

router.get(
    '/getFriendCode',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const code = await userService.getFriendCode(req.userId)
        return res.json(code)
    },
)

router.post(
    '/regenerateFriendCode',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const code = await userService.regenerateFriendCode(req.userId)
        return res.json(code)
    },
)

router.get(
    '/getCurrentProfileKey',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const key = await keyService.getCurrentProfileKey(req.userId)
        return res.json(key)
    },
)

router.get(
    '/getProfileViewersPublicKeys',
    validator.query(Schema.empty),
    validator.body(Schema.empty),
    async (req, res) => {
        const keys = await keyService.getProfileViewersPublicKeys(req.userId)
        return res.json(keys)
    },
)

router.post(
    '/createProfileKey',
    validator.query(Schema.empty),
    validator.body(Schema.createProfileKeyBody),
    async (req: ValidatedRequest<Schema.CreateProfileKeyRequest>, res) => {
        await keyService.createProfileKey(req.userId, req.body.ownerKey, req.body.viewerKeys)
        return res.json({ success: true })
    },
)

export default router
