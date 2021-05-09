import aws from 'aws-sdk'
import { Service } from 'typedi'
import config from '../config/config'

@Service()
export default class AWSService {
    private bucket: string
    private s3: aws.S3

    constructor() {
        const accessKeyId = config.string('AWS_ACCESS_KEY_ID')
        const secretKey = config.string('AWS_SECRET_KEY')
        const region = config.string('AWS_REGION')
        this.bucket = config.string('AWS_S3_BUCKET')

        aws.config.update({
            region: region,
            accessKeyId: accessKeyId,
            secretAccessKey: secretKey,
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
            Expires: config.int('UPLOAD_TIME'),
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
