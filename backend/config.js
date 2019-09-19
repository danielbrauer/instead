module.exports = {
    webPort: process.env.PORT,
    apiPort: process.env.API_PORT,
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION,
        s3Bucked: process.env.AWS_S3_BUCKET,
    },
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
}