const express = require('express')
const Post = require('../schema/post')
const User = require('../schema/user')
const FollowRequest = require('../schema/followRequest')
const awsManager = require('../aws')
const uuidv1 = require('uuid/v1')
const asyncHandler = require('express-async-handler')

const router  = express.Router()

// get the URL where images are hosted
router.get('/getConfig', (req, res) => {
    const contentUrl = awsManager.content_url_s3()
    const config = {
        contentUrl: contentUrl,
    }
    res.json({ success: true, config })
})

// this method fetches all available data in our database
router.get('/getPosts', asyncHandler(async (req, res) => {
    const user = await User.findById(req.tokenPayload.userid).exec()
    if (!user)
        return res.status(400).send('User does not exist')
    // users can't follow themselves but should see their own pictures
    user.following.push(user._id)
    const data = await Post.find({ userid: user.following }).sort({createdAt: -1}).exec()
    return res.json({ success: true, posts: data })
}))

router.get('/getFollowRequests', asyncHandler(async (req, res) => {
    const data = await FollowRequest.find({requesteeId: req.tokenPayload.userid}, 'requesterId').exec()
    return res.json({ success: true, requests: data })
}))

router.get('/getFollowers', asyncHandler(async (req, res) => {
    const user = await User.findById(req.tokenPayload.userid, 'followers').exec()
    return res.json({ success: true, followers: user.followers })
}))

router.get('/getUserById', asyncHandler(async (req, res) => {
    const userid = req.query.userid
    const user = await User.findById(userid, '_id username').exec()
    return res.json({ success: true, user })
}))

router.post('/sendFollowRequest', asyncHandler(async (req, res) => {
    const requesteeName = req.body.username
    const requestee = await User.findOne({ username: requesteeName }, '_id followers').exec()
    if (!requestee)
        return res.status(400).send('User does not exist')
    const requesterId = req.tokenPayload.userid
    if (requestee._id === requesterId)
        return res.status(400).send('You don\'t need to follow yourself')
    if (requestee.followers.find(x => x === requesterId))
        return res.status(400).send('Already following user')
    const potentialRequest = {requesterId: requesterId, requesteeId: requestee._id}
    const existingRequest = await FollowRequest.findOne(potentialRequest).exec()
    if (existingRequest)
        return res.status(400).send('Request already exists')
    potentialRequest._id = uuidv1()
    await FollowRequest.create(potentialRequest)
    return res.json({ success: true })
}))

router.post('/rejectFollowRequest', asyncHandler(async (req, res) => {
    const requesterId = req.body.userid
    const requesteeId = req.tokenPayload.userid
    await FollowRequest.findOneAndDelete({requesterId: requesterId, requesteeId: requesteeId}).exec()
    return res.json({ success: true })
}))

router.post('/acceptFollowRequest', asyncHandler(async (req, res) => {
    const requesterId = req.body.userid
    const requesteeId = req.tokenPayload.userid
    const request = await FollowRequest.findOne({requesterId: requesterId, requesteeId: requesteeId}, '_id').exec()
    if (!request)
        return res.status(400).send('No such follow request')
    const follower = await User.findOne({_id: requesterId}).exec()
    if (!follower)
        return res.status(400).send('No such user')
    const user = await User.findOne({_id: requesteeId}).exec()
    if (!user)
        return res.status(400).send('No such user')
    follower.following.push(user._id)
    await follower.save()
    user.followers.push(follower._id)
    await user.save()
    await request.remove()
    return res.json({ success: true })
}))

// removes existing data in our database, and 
// deletes the associated s3 object
router.delete('/deletePost', asyncHandler(async (req, res) => {
    const id = req.query.id
    const post = await Post.findById(id, '_id userid').exec()
    if (!post)
        return res.status(400).send('Post not found')
    if (post.userid !== req.tokenPayload.userid)
        return res.status(400).send('Can\'t delete other people\'s posts')
    await awsManager.delete_s3(post._id)
    await Post.findByIdAndDelete(post._id).exec()
    return res.json({ success: true })
}))

// get URL for uploading
router.post('/createPost', asyncHandler(async (req, res) => {
    const fileName = uuidv1()
    const newPost = {
        _id: fileName,
        userid: req.tokenPayload.userid,
        iv: req.body.iv,
        key: req.body.key,
    }
    await Post.create(newPost)
    const data = await awsManager.sign_s3(fileName, req.body.fileType)
    return res.json({ success: true, data: { signedRequest: data, fileName: fileName } })
}))

module.exports = router