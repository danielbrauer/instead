const config = require('config');
const aws = require('aws-sdk');

class AWSManager {
    constructor() {
        const awsConfig = config.get('Customer.aws');
        const accessKeyId = awsConfig.get('accessKeyId');
        const secretKey = awsConfig.get('secretKey');
        const region = awsConfig.get('region');
        this.bucket = awsConfig.get('bucket');

        aws.config.update({
            region: region,
            accessKeyId: accessKeyId,
            secretAccessKey: secretKey
        })

        this.s3 = new aws.S3()
    }
    
	static instance(){
		if (AWSManager._instance === null || 
			AWSManager._instance === undefined){
			AWSManager._instance = new AWSManager();
		}
		return AWSManager._instance
    }
    
    static content_url_s3() {
        return `https://${AWSManager.instance().bucket}.s3.amazonaws.com/`
    }

    static sign_s3(fileName, fileType, successCallback, errorCallback) {
        // Set up the payload of what we are sending to the S3 api
        const s3Params = {
            Bucket: AWSManager.instance().bucket,
            Key: fileName,
            Expires: 300,
            ContentType: fileType,
            ACL: 'public-read',
        };
        // Make a request to the S3 API to get a signed URL which we can use to upload our file
        AWSManager.instance().s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if (err) {
                console.log(err, err.stack)
                return errorCallback(err)
            }

            return successCallback(data)
        });
    }

    static delete_s3(key, successCallback, errorCallback) {
        const s3Params = {
            Bucket: AWSManager.instance().bucket, 
            Key: key,
        };
        AWSManager.instance().s3.deleteObject(s3Params, (err, data) => {
            if (err) {
                console.log(err, err.stack)
                errorCallback(err)
                return
            }
            
            successCallback(data)
        });
    }
}

module.exports = AWSManager;