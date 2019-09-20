export default {
    serverUrl: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_API_URL : '',
}