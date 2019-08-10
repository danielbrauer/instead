import express from 'express'
import Post from '../schema/post'
import User from '../schema/user'
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
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true, data: data })
    });
});

router.get('/getUserById', (req, res) => {
    const userid = req.param("userid")
    User.findById(userid, '_id username', (err, user) => {
        if (err) return res.send(err)
        console.log(user)
        return res.json({ success: true, user })
    })
})

// removes existing data in our database, and 
// deletes the associated s3 object
router.delete('/deletePost', (req, res) => {
    const id = req.param("id")
    Post.findById(id, '_id', (err, data) => {
        if (err) return res.send(err)
        awsManager.delete_s3(data._id,
            () => {
                Post.findByIdAndDelete(data._id, (err) => {
                    if (err) return res.send(err)
                    return res.json({ success: true })
                });
            },
            err => {
                return res.json({ success: false })
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
        if (err) return res.json({ success: false, error: err })
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