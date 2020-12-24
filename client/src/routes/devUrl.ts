import * as config from '../config'

export default config.isLocalDev() ? config.string('REACT_APP_LOCAL_API_URL'): ''