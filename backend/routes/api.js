const express = require('express')
const Post = require('../schema/post')
const User = require('../schema/user')
const FollowRequest = require('../schema/followRequest')
const awsManager = require('../aws')
const uuidv1 = require('uuid/v1')

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
router.get('/getPosts', (req, res) => {
    User.findById(req.tokenPayload.userid, (err, user) => {
        if (err) return res.status(500).send(err)
        if (!user) return res.status(400).send('User does not exist')
        user.following.push(user._id)
        Post.find({ userid: user.following }, (err, data) => {
            if (err) return res.status(500).send(err)
            return res.json({ success: true, posts: data })
        })
    })
})

router.get('/getFollowRequests', (req, res) => {
    FollowRequest.find({requesteeId: req.tokenPayload.userid}, 'requesterId', (err, data) => {
        if (err) return res.status(500).send(err)
        return res.json({ success: true, requests: data })
    })
})

router.get('/getFollowers', (req, res) => {
    User.findById(req.tokenPayload.userid, 'followers', (err, user) => {
        if (err) return res.status(500).send(err)
        return res.json({ success: true, followers: user.followers })
    })
})

router.get('/getUserById', (req, res) => {
    const userid = req.query.userid
    User.findById(userid, '_id username', (err, user) => {
        if (err) return res.status(500).send(err)
        return res.json({ success: true, user })
    })
})

router.post('/sendFollowRequest', (req, res) => {
    const requesteeName = req.body.username
    User.findOne({ username: requesteeName }, '_id', (err, requestee) => {
        if (err) return res.status(500).send(err)
        if (!requestee) return res.status(400).send('User does not exist')
        const requesterId = req.tokenPayload.userid
        if (requestee._id === requesterId)
            return res.status(400).send('You don\'t need to follow yourself')
        const potentialRequest = {requesterId: requesterId, requesteeId: requestee._id}
        FollowRequest.findOne(potentialRequest, (err, existingRequest) => {
            if (err) return res.status(500).send(err)
            if (existingRequest) return res.status(400).send('Request already exists')
            potentialRequest._id = uuidv1()
            FollowRequest.create(potentialRequest, (err, newRequest) => {
                if (err) return res.status(500).send(err)
                return res.json({ success: true })
            })
        })
    })
})

router.post('/rejectFollowRequest', (req, res) => {
    const requesterId = req.body.userid
    const requesteeId = req.tokenPayload.userid
    FollowRequest.findOneAndDelete({requesterId: requesterId, requesteeId: requesteeId}, (err, request) => {
        if (err) return res.status(500).send(err)
        return res.json({ success: true })
    })
})

router.post('/acceptFollowRequest', (req, res) => {
    const requesterId = req.body.userid
    const requesteeId = req.tokenPayload.userid
    FollowRequest.findOne({requesterId: requesterId, requesteeId: requesteeId}, '_id', (err, request) => {
        if (err) return res.status(500).send(err)
        if (!request) return res.status(400).send('No such follow request')
        User.findOne({_id: requesterId}, (err, follower) => {
            if (err) return res.status(500).send(err)
            if (!follower) return res.status(400).send('No such user')
            User.findOne({_id: requesteeId}, (err, user) => {
                if (err) return res.status(500).send(err)
                if (!user) return res.status(400).send('No such user')
                follower.following.push(user._id)
                follower.save((err) => {
                    if (err) return res.status(500).send(err)
                    user.followers.push(follower._id)
                    user.save((err) => {
                        if (err) {
                            //not sure how to recover here
                            if (err) return res.status(500).send(err)
                        }
                        request.remove((err) => {
                            if (err) {
                                //not sure how to recover here
                                if (err) return res.status(500).send(err)
                            }
                            return res.json({ success: true })
                        })
                    })
                })
            })
        })
    })
})

// removes existing data in our database, and 
// deletes the associated s3 object
router.delete('/deletePost', (req, res) => {
    const id = req.query.id
    Post.findById(id, '_id userid', (err, post) => {
        if (err) return res.status(500).send(err)
        if (!post) return res.status(400).send('Post not found')
        if (post.userid !== req.tokenPayload.userid)
            return res.status(400).send('Can\'t delete other people\'s posts')
        awsManager.delete_s3(post._id,
            () => {
                Post.findByIdAndDelete(post._id, (err) => {
                    if (err) return res.status(500).send(err)
                    return res.json({ success: true })
                })
            },
            err => {
                return res.status(500).send(err)
            }
        )
    })
})

// get URL for uploading
router.post('/createPost', (req, res) => {
    const fileName = uuidv1()
    Post.create(
        {
            _id: fileName,
            userid: req.tokenPayload.userid,
        },
    (err, data) => {
        if (err) return res.status(500).send(err)
        awsManager.sign_s3(fileName, req.body.fileType,
            data => {
                return res.json({ success: true, data: { signedRequest: data, fileName: fileName } })
            },
            err => {
                return res.json({ success: false })
            }
        )
    })
})

module.exports = router