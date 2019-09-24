import session from 'express-session'
import config from './config'

let sessionConfig = {
    secret: config.sessionSecret,
    name: 'instead-photos',
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