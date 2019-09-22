import session from 'express-session'
import config from './config'

let sessionConfig = {
    secret: config.sessionSecret,
    name: 'instead-photos',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false,
    },
}

if (!config.localDev) {
    sessionConfig.cookie.secure = true
}

export default session(sessionConfig)