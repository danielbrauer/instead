import cors, { CorsOptions } from 'cors'
import config from './config'

let settings : CorsOptions = {
    origin: function (origin, callback) {
        if (origin === config.clientOrigin || !origin) {
            callback(null, true)
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`))
        }
    },
    credentials: true,
}

export default cors(settings)