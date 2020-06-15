import Router from 'express-promise-router'
import db from '../services/database'
import awsManager from '../services/aws'
import * as Users from '../queries/users.gen'
import * as Followers from '../queries/followers.gen'
import * as Posts from '../queries/posts.gen'
import * as FollowRequests from '../queries/follow_requests.gen'
import uuidv1 from 'uuid/v1'

const router = Router()

// get the URL where images are hosted
router.get('/getConfig', (req, res) => {
    const contentUrl = awsManager.s3ContentUrl()
    const config = {
        contentUrl: contentUrl,
    }
    res.json({ success: true, config })
})

router.get('/getPosts', async (req, res) => {
    const posts = await db.query(
        Posts.getByAuthorId,
        { authorId: req.user.id }
    )
    return res.json({ success: true, posts })
})

router.get('/getFollowRequests', async (req, res) => {
    const requests = await db.query(
        FollowRequests.getByRequesteeId,
        { requesteeId: req.user.id }
    )
    return res.json({ success: true, requests })
})

router.get('/getFollowerIds', async (req, res) => {
    const following = await db.query(
        Followers.getByFolloweeId,
        { followeeId: req.user.id }
    )
    return res.json({ success: true, followers: following.map(r => r.follower_id) })
})

router.get('/getFollowees', async (req, res) => {
    const following = await db.query(
        Followers.getByFollowerId,
        { followerId: req.user.id }
    )
    return res.json({ success: true, followees: following.map(r => r.followee_id) })
})

router.get('/getUserById', async (req, res) => {
    const user = await db.queryOne(
        Users.getById,
        { userId : parseInt(req.query.userid as string)}
    )
    if (!user)
        return res.status(400).send('User does not exist')
    return res.json({ success: true, user: user })
})

router.post('/sendFollowRequest', async (req, res) => {
    const error = await db.transaction(async(db) => {
        const requesteeName = req.body.username
        const requestee = await db.queryOne(
            Users.getByName,
            { username: requesteeName }
        )
        if (!requestee)
            return [400, 'User does not exist']
        const requesterId = req.user.id
        if (requestee.id === requesterId)
            return [400, 'You don\'t need to follow yourself']
        const followCount = await db.count(
            Followers.count,
            { followerId: requesterId, followeeId: requestee.id }
        )
        if (followCount > 0)
            return [400, 'Already following user']
        const requestCount = await db.count(
            FollowRequests.count,
            { requesterId: requesterId, requesteeId: requestee.id }
        )
        if (requestCount > 0)
            return [400, 'Request already exists']
        await db.query(
            FollowRequests.create,
            { requesterId: requesterId, requesteeId: requestee.id }
        )
    })
    if (error)
        return res.status(error[0]).send(error[1])
    return res.json({ success: true })
})

router.post('/rejectFollowRequest', async (req, res) => {
    await db.query(
        FollowRequests.destroy,
        {requesterId: req.body.userid, requesteeId: req.user.id}
    )
    return res.json({ success: true })
})

router.post('/unfollow', async (req, res) => {
    await db.query(
        Followers.destroy,
        { followerId: req.user.id, followeeId: req.body.userid}
    )
    return res.json({ success: true })
})

router.post('/removeFollower', async (req, res) => {
    await db.query(
        Followers.destroy,
        { followerId: req.body.userid, followeeId: req.user.id }
    )
    return res.json({ success: true })
})

router.post('/acceptFollowRequest', async (req, res) => {
    const error = await db.transaction(async(client) => {
        const request = await client.queryOne(
            FollowRequests.destroyAndReturn,
            { requesterId: req.body.userid, requesteeId: req.user.id}
        )
        if (!request)
            return { status:400, message:'No such follow request' }
        await client.query(
            Followers.create,
            { followerId: request.requester_id, followeeId: request.requestee_id}
        )
    })
    if (error)
        return res.status(error.status).send(error.message)
    return res.json({ success: true })
})

// removes existing data in our database, and
// deletes the associated s3 object
router.delete('/deletePost', async (req, res) => {
    const deleted = await db.queryOne(
        Posts.destroyAndReturn,
        { postId: parseInt(req.query.id as string), authorId: req.user.id}
    )
    if (!deleted)
        return res.status(400).send('Post not found')
    return res.json({ success: true })
})

// get URL for uploading
router.post('/createPost', async (req, res) => {
    const fileName = uuidv1()
    const postPromise = db.queryOne(
        Posts.create,
        { fileName, authorId: req.user.id, iv: req.body.iv, key: req.body.key }
    )
    const requestPromise = awsManager.s3GetSignedUploadUrl(fileName, req.body.fileType)
    const [signedRequest, ] = await Promise.all([requestPromise, postPromise])
    return res.json({ success: true, data: { signedRequest, fileName } })
})

router.get('/logout', async function (req, res) {
    req.session.destroy(err => {
        if (err)
            res.status(500).send('Could not end session')
        else
            res.send('Logged out')
    })
})

export default router