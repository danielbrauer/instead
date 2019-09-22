export default {
    localDev: process.env.NODE_ENV != 'production',
    clientOrigin: process.env.CLIENT_ORIGIN,
    webPort: process.env.PORT,
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION,
        s3Bucket: process.env.AWS_S3_BUCKET,
    },
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET,
}