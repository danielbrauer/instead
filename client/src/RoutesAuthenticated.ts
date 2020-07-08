
import config from './config'
import Axios from 'axios'
import { PostsResponse } from './types/ResponseTypes'

const serverUrl = `${config.serverUrl}/api`

const authorizedAxios = Axios.create({ withCredentials: true })
authorizedAxios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response?.status === 401) {
        console.log('Not logged in')
        // this.goToLogin()
    }
    return Promise.reject(error)
})

export const getPosts = async() => {
    const response = await authorizedAxios.get<PostsResponse>(serverUrl + '/getPosts')
    return response.data.posts
}