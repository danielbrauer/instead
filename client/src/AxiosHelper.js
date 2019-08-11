
class AxiosHelper {
    static logError(error) {
        if (error.response) {
            // Request made and server responded
            console.warn(error.response.data)
            console.warn(error.response.status)
            console.warn(error.response.headers)
        } else if (error.request) {
            // The request was made but no response was received
            console.warn(error.request)
        } else {
            // Something happened in setting up the request that triggered an Error
            console.warn('Error', error.message)
        }
    }
}

module.exports = AxiosHelper