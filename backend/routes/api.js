const Router = require('express-promise-router')
const db = require('../database')
const awsManager = require('../aws')
const uuidv1 = require('uuid/v1')

const router = new Router()

// get the URL where images are hosted
router.get('/getConfig', (req, res) => {
    const contentUrl = awsManager.content_url_s3()
    const config = {
        contentUrl: contentUrl,
    }
    res.json({ success: true, config })
})

router.get('/getPosts', async (req, res) => {
    const { rows } = await db.query(
        `SELECT * FROM posts WHERE author_id = $1 OR author_id IN (
            SELECT followee_id
            FROM followers
            WHERE followers.follower_id = $1
        ) ORDER BY timestamp DESC`,
        [req.tokenPayload.userid]
    )
    return res.json({ success: true, posts: rows })
})

router.get('/getFollowRequests', async (req, res) => {
    const { rows } = await db.query(
        'SELECT requester_id FROM follow_requests WHERE requestee_id = $1',
        [req.tokenPayload.userid]
    )
    return res.json({ success: true, requests: rows })
})

router.get('/getFollowers', async (req, res) => {
    const { rows } = await db.query(
        'SELECT follower_id FROM followers WHERE followee_id = $1',
        [req.tokenPayload.userid]
    )
    return res.json({ success: true, followers: rows.map(r => r.follower_id) })
})

router.get('/getUserById', async (req, res) => {
    const user = await db.queryOne(
        'SELECT id, username FROM users WHERE id = $1',
        [req.query.userid]
    )
    if (!user)
        return res.status(400).send('User does not exist')
    return res.json({ success: true, user: user })
})

router.post('/sendFollowRequest', async (req, res) => {
    const error = await db.transaction(async(client) => {
        const requesteeName = req.body.username
        const requestee = await db.queryOne(
            'SELECT id FROM users WHERE username = $1',
            [requesteeName]
        )
        if (!requestee)
            return [400, 'User does not exist']
        const requesterId = req.tokenPayload.userid
        if (requestee.id === requesterId)
            return [400, 'You don\'t need to follow yourself']
        const followCount = await db.count(
            'SELECT COUNT(*) FROM followers WHERE follower_id = $1 AND followee_id = $2',
            [requesterId, requestee.id]
        )
        if (followCount > 0)
            return [400, 'Already following user']
        const requestCount = await db.count(
            'SELECT COUNT(*) FROM follow_requests WHERE requester_id = $1 AND requestee_id = $2',
            [requesterId, requestee.id]
        )
        if (requestCount > 0)
            return [400, 'Request already exists']
        await db.query(
            'INSERT INTO follow_requests (requester_id, requestee_id) VALUES ($1, $2)',
            [requesterId, requestee.id]
        )
    })
    if (error)
        return res.status(error[0]).send(error[1])
    return res.json({ success: true })
})

router.post('/rejectFollowRequest', async (req, res) => {
    await db.query(
        'DELETE FROM follow_requests WHERE requester_id = $1 AND requestee_id = $2',
        [req.body.userid, req.tokenPayload.userid]
    )
    return res.json({ success: true })
})

router.post('/acceptFollowRequest', async (req, res) => {
    const error = await db.transaction(async(client) => {
        const request = await client.queryOne(
            'DELETE FROM follow_requests WHERE requester_id = $1 AND requestee_id = $2 RETURNING *',
            [req.body.userid, req.tokenPayload.userid]
        )
        if (!request)
            return { status:400, message:'No such follow request' }
        await client.query(
            'INSERT INTO followers (follower_id, followee_id) VALUES ($1, $2)',
            [request.requester_id, request.requestee_id]
        )
    })
    if (error)
        return res.status(error.status).send(error.message)
    return res.json({ success: true })
})

// removes existing data in our database, and 
// deletes the associated s3 object
router.delete('/deletePost', async (req, res) => {
    const deleted = await db.query(
        'DELETE FROM posts WHERE id = $1 AND author_id = $2 RETURNING *',
        [req.query.id, req.tokenPayload.userid]
    )
    if (!deleted)
        return res.status(400).send('Post not found')
    return res.json({ success: true })
})

// get URL for uploading
router.post('/createPost', async (req, res) => {
    const fileName = uuidv1()
    const postPromise = db.queryOne(
        'INSERT INTO posts (filename, author_id, iv, key) VALUES ($1, $2, $3, $4)',
        [fileName, req.tokenPayload.userid, req.body.iv, req.body.key]
    )
    const requestPromise = awsManager.sign_s3(fileName, req.body.fileType)
    const [signedRequest, ] = await Promise.all([requestPromise, postPromise])
    return res.json({ success: true, data: { signedRequest, fileName } })
})

module.exports = router