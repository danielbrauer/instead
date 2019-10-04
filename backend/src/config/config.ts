function split(input : string) {
    if (input === null || input === undefined)
        return []
    else
        return input.split(',')
}

export default {
    localDev: process.env.NODE_ENV != 'production',
    clientOrigin: split(process.env.CLIENT_ORIGIN),
    webPort: process.env.PORT,
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION,
        s3Bucket: process.env.AWS_S3_BUCKET,
    },
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    sessionSecret: split(process.env.SECURE_KEY),
    garbageSeed: process.env.GARBAGE_SEED,
}