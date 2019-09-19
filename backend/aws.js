const config = require('./config')
const aws = require('aws-sdk')

class AWSManager {
    constructor() {
        const awsConfig = config.aws
        const accessKeyId = awsConfig.accessKeyId
        const secretKey = awsConfig.secretKey
        const region = awsConfig.region
        this.bucket = awsConfig.s3Bucket

        aws.config.update({
            region: region,
            accessKeyId: accessKeyId,
            secretAccessKey: secretKey
        })

        this.s3 = new aws.S3()
    }
    
	static instance(){
		if (AWSManager._instance === null || AWSManager._instance === undefined){
			AWSManager._instance = new AWSManager()
		}
		return AWSManager._instance
    }
    
    static content_url_s3() {
        return `https://${AWSManager.instance().bucket}.s3.amazonaws.com/`
    }

    static async sign_s3(fileName, fileType) {
        // Set up the payload of what we are sending to the S3 api
        const s3Params = {
            Bucket: AWSManager.instance().bucket,
            Key: fileName,
            Expires: 300,
            ContentType: fileType,
            ACL: 'public-read',
        }
        // Make a request to the S3 API to get a signed URL which we can use to upload our file
        const data = await AWSManager.instance().s3.getSignedUrlPromise('putObject', s3Params)
        return data
    }

    static async delete_s3(key) {
        const s3Params = {
            Bucket: AWSManager.instance().bucket, 
            Key: key,
        }
        const data = await AWSManager.instance().s3.deleteObject(s3Params).promise()
        return data
    }
}

module.exports = AWSManager