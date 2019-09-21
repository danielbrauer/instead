import config from './config'
import aws from 'aws-sdk'

export default class AWSManager {
    static _instance: AWSManager
    bucket: string
    s3: any

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
    
    static s3ContentUrl() {
        return `https://${AWSManager.instance().bucket}.s3.amazonaws.com/`
    }

    static async s3GetSignedUploadUrl(fileName: string, fileType: string) {
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

    static async s3DeleteObject(key: string) {
        const s3Params = {
            Bucket: AWSManager.instance().bucket, 
            Key: key,
        }
        const data = await AWSManager.instance().s3.deleteObject(s3Params).promise()
        return data
    }
}
