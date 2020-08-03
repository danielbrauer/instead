function split(input: string) {
    if (input === null || input === undefined)
        return []
    else
        return input.split(',')
}

function requireVar(name: string) {
    const value = process.env[name]
    if (value === undefined)
        throw new Error(`Environment variable ${name} required, but not found`)
    return value
}

export default {
    localDev: process.env.NODE_ENV != 'production',
    clientOrigin: split(requireVar('CLIENT_ORIGIN')),
    webPort: requireVar('PORT'),
    aws: {
        accessKeyId: requireVar('AWS_ACCESS_KEY_ID'),
        secretKey: requireVar('AWS_SECRET_KEY'),
        region: requireVar('AWS_REGION'),
        s3Bucket: requireVar('AWS_S3_BUCKET'),
    },
    uploadTime: parseInt(requireVar('UPLOAD_TIME')),
    minimumAuthTime: parseInt(requireVar('MIN_AUTH_TIME')),
    maxAuthTime: parseInt(requireVar('MAX_AUTH_TIME')),
    databaseUrl: requireVar('DATABASE_URL'),
    redisUrl: requireVar('REDIS_URL'),
    sessionSecret: split(requireVar('SECURE_KEY')),
    garbageSeed: requireVar('GARBAGE_SEED'),
}