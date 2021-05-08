import cors, { CorsOptions } from 'cors'
import config from '../config/config'

const settings: CorsOptions = {
    origin: function (origin, callback) {
        if (config.strings('CLIENT_ORIGIN').some((x) => x === origin) || !origin) {
            callback(null, true)
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`))
        }
    },
    credentials: true,
}

export default cors(settings)
