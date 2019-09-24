import session from 'express-session'
import redis from 'redis'
import config from './config'

const RedisStore = require('connect-redis')(session)
const client = redis.createClient({
    url: config.redisUrl,
})

let sessionConfig = {
    secret: config.sessionSecret,
    name: 'instead-photos',
    store: new RedisStore({ client }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
}

if (!config.localDev) {
    sessionConfig.cookie.secure = true
}

export default session(sessionConfig)