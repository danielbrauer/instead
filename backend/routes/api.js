import express from 'express'
import Post from '../schema/post'
import User from '../schema/user'
import FollowRequest from '../schema/followRequest'
import awsManager from '../aws'
import uuidv1 from 'uuid/v1'

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
    Post.find({ userid: req.tokenPayload.userid }, (err, data) => {
        if (err) return res.status(500).send(err)
        return res.json({ success: true, data: data })
    });
});

router.get('/getFollowRequests', (req, res) => {
    FollowRequest.find({requesteeId: req.tokenPayload.userid}, 'requesterId', (err, data) => {
        if (err) return res.status(500).send(err)
        return res.json({ success: true, data: data })
    })
})

router.get('/getUserById', (req, res) => {
    const userid = req.query.userid
    User.findById(userid, '_id username', (err, user) => {
        if (err) return res.status(500).send(err)
        return res.json({ success: true, user })
    })
})

router.get('/sendFollowRequest', (req, res) => {
    const requesteeName = req.query.username
    User.findOne({ username: requesteeName }, '_id', (err, requestee) => {
        if (err) return res.status(500).send(err)
        if (requestee === null) return res.status(400).send('User does not exist')
        const requesterId = req.tokenPayload.userid
        const potentialRequest = {requesterId: requesterId, requesteeId: requestee._id}
        FollowRequest.findOne(potentialRequest, (err, existingRequest) => {
            if (err) return res.status(500).send(err)
            if (existingRequest !== null) return res.status(400).send('Request already exists')
            potentialRequest._id = uuidv1()
            FollowRequest.create(potentialRequest, (err, newRequest) => {
                if (err) return res.status(500).send(err)
                return res.json({ success: true })
            })
        })
    })
})

// removes existing data in our database, and 
// deletes the associated s3 object
router.delete('/deletePost', (req, res) => {
    const id = req.query.id
    Post.findById(id, '_id', (err, data) => {
        if (err) return res.status(500).send(err)
        if (data === null) return res.status(400).send('Post not found')
        awsManager.delete_s3(data._id,
            () => {
                Post.findByIdAndDelete(data._id, (err) => {
                    if (err) return res.status(500).send(err)
                    return res.json({ success: true })
                });
            },
            err => {
                return res.status(500).send(err)
            }
        );
    });
});

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