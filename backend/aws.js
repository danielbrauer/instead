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

        this.s3 = new aws.S3();
    }
    
	static instance(){
		if (AWSManager._instance === null || 
			AWSManager._instance === undefined){
			AWSManager._instance = new AWSManager();
		}
		return AWSManager._instance;	
	}

    sign_s3(fileName, fileType, successCallback, errorCallback) {
        // Set up the payload of what we are sending to the S3 api
        const s3Params = {
            Bucket: this.bucket,
            Key: fileName,
            Expires: 500,
            ContentType: fileType,
            ACL: 'public-read',
        };
        // Make a request to the S3 API to get a signed URL which we can use to upload our file
        this.s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                return errorCallback(err);
            }
            // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
            const returnData = {
                signedRequest: data,
                url: `https://${this.bucket}.s3.amazonaws.com/${fileName}`,
            };

            return successCallback(returnData)
        });
    }

    delete_s3(key, successCallback, errorCallback) {
        const s3Params = {
            Bucket: this.bucket, 
            Key: key,
        };
        this.s3.deleteObject(s3Params, (err, data) => {
            if (err) {
                console.log(err, err.stack)
                errorCallback(err)
                return
            }
            
            successCallback(data)
        });
    }
}

module.exports.AWSManager = AWSManager;