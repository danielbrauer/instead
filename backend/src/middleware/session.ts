import session, { SessionOptions } from 'express-session'
import redis from 'redis'
import * as config from '../config/config'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisStore = require('connect-redis')(session)
const client = redis.createClient({
    url: config.string('REDIS_URL'),
})

const sessionConfig: SessionOptions = {
    secret: config.strings('SECURE_KEY'),
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

if (!config.isLocalDev()) {
    sessionConfig.cookie.secure = true
}

export default session(sessionConfig)