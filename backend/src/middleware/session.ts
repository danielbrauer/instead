import session, { SessionOptions } from 'express-session'
import redis from 'redis'
import { isLocalDev, requireStrings, requireString } from '../config/config'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisStore = require('connect-redis')(session)
const client = redis.createClient({
    url: requireString('REDIS_URL'),
})

const sessionConfig: SessionOptions = {
    secret: requireStrings('SECURE_KEY'),
    name: 'instead-photos',
    store: new RedisStore({ client }),
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 14 * 24 * 60 * 60 * 1000,
    },
}

if (!isLocalDev()) {
    sessionConfig.cookie.secure = true
}

export default session(sessionConfig)