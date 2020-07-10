import session, { SessionOptions } from 'express-session'
import redis from 'redis'
import config from '../config/config'

const RedisStore = require('connect-redis')(session)
const client = redis.createClient({
    url: config.redisUrl,
})

const sessionConfig: SessionOptions = {
    secret: config.sessionSecret,
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

if (!config.localDev) {
    sessionConfig.cookie.secure = true
}

export default session(sessionConfig)