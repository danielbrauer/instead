import { Service } from 'typedi'
import config from '../config/config'
import aws from 'aws-sdk'

@Service()
export default class AWSService {
    private bucket: string
    private s3: aws.S3

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

    s3ContentUrl() {
        return `https://${this.bucket}.s3.amazonaws.com/`
    }

    async s3GetSignedUploadUrl(fileName: string, fileType: string, md5: string) {
        // Set up the payload of what we are sending to the S3 api
        const s3Params = {
            Bucket: this.bucket,
            Key: fileName,
            Expires: config.uploadTime,
            ContentType: fileType,
            ContentMD5: md5,
            ACL: 'public-read',
        }
        // Make a request to the S3 API to get a signed URL which we can use to upload our file
        const data = await this.s3.getSignedUrlPromise('putObject', s3Params)
        return data
    }

    async s3DeleteObject(key: string) {
        const s3Params = {
            Bucket: this.bucket,
            Key: key,
        }
        const data = await this.s3.deleteObject(s3Params).promise()
        return data
    }
}
