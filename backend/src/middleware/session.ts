import connectRedis from 'connect-redis'
import session, { SessionOptions } from 'express-session'
import redis from 'redis'
import * as config from '../config/config'

const RedisStore = connectRedis(session)

const redisOptions = config.isLocalDev()
    ? {
          url: config.string('REDIS_URL'),
      }
    : {
          url: config.string('REDIS_TLS_URL'),
          tls: {
              rejectUnauthorized: false,
          },
      }

const client = redis.createClient(redisOptions)

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
        sameSite: 'strict',
        maxAge: 14 * 24 * 60 * 60 * 1000,
    },
}

if (!config.isLocalDev()) {
    sessionConfig.cookie.secure = true
}

export default session(sessionConfig)
