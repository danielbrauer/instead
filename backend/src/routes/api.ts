import Router from 'express-promise-router'
import db, { transaction } from '../services/database'
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
    const posts = await Posts.getByAuthorId.run(
        { authorId: req.user.id },
        db
    )
    return res.json({ success: true, posts })
})

router.get('/getFollowRequests', async (req, res) => {
    const requests = await FollowRequests.getByRequesteeId.run(
        { requesteeId: req.user.id },
        db
    )
    return res.json({ success: true, requests })
})

router.get('/getFollowerIds', async (req, res) => {
    const following = await Followers.getByFolloweeId.run(
        { followeeId: req.user.id },
        db
    )
    return res.json({ success: true, followers: following.map(r => r.follower_id) })
})

router.get('/getFollowees', async (req, res) => {
    const following = await Followers.getByFollowerId.run(
        { followerId: req.user.id },
        db
    )
    return res.json({ success: true, followees: following.map(r => r.followee_id) })
})

router.get('/getUserById', async (req, res) => {
    const [user] = await Users.getById.run(
        { userId : parseInt(req.query.userid as string)},
        db
    )
    if (!user)
        return res.status(400).send('User does not exist')
    return res.json({ success: true, user: user })
})

router.post('/sendFollowRequest', async (req, res) => {
    const error = await transaction(async(db) => {
        const requesteeName = req.body.username
        const [requestee] = await Users.getByName.run(
            { username: requesteeName },
            db
        )
        if (!requestee)
            return [400, 'User does not exist']
        const requesterId = req.user.id
        if (requestee.id === requesterId)
            return [400, 'You don\'t need to follow yourself']
        const [{count: followCount}] = await Followers.count.run(
            { followerId: requesterId, followeeId: requestee.id },
            db
        )
        if (followCount > 0)
            return [400, 'Already following user']
        const [{count: requestCount}] = await FollowRequests.count.run(
            { requesterId: requesterId, requesteeId: requestee.id },
            db
        )
        if (requestCount > 0)
            return [400, 'Request already exists']
        await FollowRequests.create.run(
            { requesterId: requesterId, requesteeId: requestee.id },
            db
        )
    })
    if (error)
        return res.status(error[0]).send(error[1])
    return res.json({ success: true })
})

router.post('/rejectFollowRequest', async (req, res) => {
    await FollowRequests.destroy.run(
        {requesterId: req.body.userid, requesteeId: req.user.id},
        db
    )
    return res.json({ success: true })
})

router.post('/unfollow', async (req, res) => {
    await Followers.destroy.run(
        { followerId: req.user.id, followeeId: req.body.userid},
        db
    )
    return res.json({ success: true })
})

router.post('/removeFollower', async (req, res) => {
    await Followers.destroy.run(
        { followerId: req.body.userid, followeeId: req.user.id },
        db
    )
    return res.json({ success: true })
})

router.post('/acceptFollowRequest', async (req, res) => {
    const error = await transaction(async(db) => {
        const [request] = await FollowRequests.destroyAndReturn.run(
            { requesterId: req.body.userid, requesteeId: req.user.id},
            db
        )
        if (!request)
            return { status:400, message:'No such follow request' }
        await Followers.create.run(
            { followerId: request.requester_id, followeeId: request.requestee_id},
            db
        )
    })
    if (error)
        return res.status(error.status).send(error.message)
    return res.json({ success: true })
})

// removes existing data in our database, and
// deletes the associated s3 object
router.delete('/deletePost', async (req, res) => {
    const [deleted] = await Posts.destroyAndReturn.run(
        { postId: parseInt(req.query.id as string), authorId: req.user.id},
        db
    )
    if (!deleted)
        return res.status(400).send('Post not found')
    else
        await awsManager.s3DeleteObject(deleted.filename)
    return res.json({ success: true })
})

// get URL for uploading
router.post('/createPost', async (req, res) => {
    const fileName = uuidv1()
    const postPromise = Posts.create.run(
        { fileName, authorId: req.user.id, iv: req.body.iv, key: req.body.key },
        db
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