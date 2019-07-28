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

    sign_s3(req, res) {
        const fileName = req.body.fileName;
        const fileType = req.body.fileType;
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
                console.log(err);
                res.json({ success: false, data: err });
                return;
            }
            // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
            const returnData = {
                signedRequest: data,
                url: `https://${this.bucket}.s3.amazonaws.com/${fileName}`
            };
            // Send it all back
            res.json({ success: true, data: { returnData } });
        });
    }

    delete_s3(fileName, callback, errorCallback) {
        const urlPart = fileName.split("/");
        const s3Params = {
            Bucket: this.bucket, 
            Key: urlPart[urlPart.length - 1],
        };
        this.s3.deleteObject(s3Params, (err, data) => {
            if (err) {
                console.log(err, err.stack)
                errorCallback(error)
                return
            }
            
            callback(data)
        });
    }
}

module.exports.AWSManager = AWSManager;