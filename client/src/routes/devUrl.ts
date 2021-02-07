import * as config from '../config'

export default config.isLocalDev() ? process.env.REACT_APP_LOCAL_API_URL || '' : ''