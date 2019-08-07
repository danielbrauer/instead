const express = require('express')
const Data = require('../schema/data')
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
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true, data: data })
    });
});

// removes existing data in our database, and 
// deletes the associated s3 object
router.delete('/deleteData', (req, res) => {
    const { id } = req.body
    Data.findById(id, (err, data) => {
        if (err) return res.send(err)
        awsManager.delete_s3(data.fileName,
            () => {
                Data.findByIdAndDelete(id, (err) => {
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
router.post('/getUploadUrl', (req, res) => {
    const fileName = uuidv1()
    awsManager.sign_s3(fileName, req.body.fileType,
        data => {
            return res.json({ success: true, data: { signedRequest: data, fileName: fileName } })
        },
        err => {
            return res.json({ success: false })
        }
    )
})

// this method adds a new post (at a POST, incidentally)
router.post('/putData', (req, res) => {
    Data.create(req.body, (err, data) => {
        if (err) return res.json({ success: false, error: err })
        console.log(data)
        return res.json({ success: true })
    })
});

module.exports = router