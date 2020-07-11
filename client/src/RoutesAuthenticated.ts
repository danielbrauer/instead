
import config from './config'
import Axios from 'axios'
import { User, Post, DeletePostResult, StartPostResult, FinishPostResult, EncryptedPostKey } from '../../backend/src/types/api'
import { queryCache } from 'react-query'

const baseURL = `${config.serverUrl}/api`

const authorizedAxios = Axios.create({ withCredentials: true, baseURL })
authorizedAxios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response?.status === 401) {
        console.log('Not logged in')
        // this.goToLogin()
    } else if (error.response?.status === 400) {
        throw new Error(error.response.data)
    }
    Promise.reject(error)
})

export const logOut = async() => {
    await authorizedAxios.get('/logout')
}

export const getContentUrl = async() => {
    const response = await authorizedAxios.get<string>('/getContentUrl')
    return response.data
}

export const getPosts = async() => {
    const response = await authorizedAxios.get<Post[]>('/getPosts')
    return response.data
}

export const deletePost = async (idTodelete: number) => {
    const response = await authorizedAxios.delete<DeletePostResult>('/deletePost', {
        params: {
            id: idTodelete,
        },
    })
    queryCache.invalidateQueries('posts')
    return response.data
}

export const getCurrentKey = async () => {
    const response = await authorizedAxios.get<EncryptedPostKey>('/getCurrentKey')
    return response.data
}

export const startPost = async(exportedKey: JsonWebKey, ivBase64: string, contentMD5Base64: string) => {
    const postResponse = await authorizedAxios.post<StartPostResult>('/startPost', {
        key: exportedKey,
        iv: ivBase64,
        md5: contentMD5Base64
    })
    return postResponse.data
}

export const finishPost = async(postId: number, success: boolean) => {
    await authorizedAxios.post<FinishPostResult>('/finishPost', {
        postId,
        success
    })
}

export const getUser = async(key: string, userid: number) => {
    const response = await authorizedAxios.get<User>('/getUserById', {
        params: {userid: userid}
    })
    return response.data
}

export const sendFollowRequest = async (username: string) => {
    await authorizedAxios.post('/sendFollowRequest', {
        username: username,
    })
}

export const rejectFollowRequest = async (userid: number) => {
    await authorizedAxios.post('/rejectFollowRequest', {
        userid: userid
    })
    queryCache.invalidateQueries('followRequests')
}

export const unfollow = async (userid: number) => {
    await authorizedAxios.post('/unfollow', {
        userid: userid
    })
    queryCache.invalidateQueries('followees')
}

export const removeFollower = async (userid: number) => {
    await authorizedAxios.post('/removeFollower', {
        userid: userid
    })
    queryCache.invalidateQueries('followers')
}

export const acceptFollowRequest = async (userid: number) => {
    await authorizedAxios.post('/acceptFollowRequest', {
        userid: userid
    })
    queryCache.invalidateQueries('followers')
    queryCache.invalidateQueries('followRequests')
}

export const getFollowers = async() => {
    const response = await authorizedAxios.get<number[]>('/getFollowerIds')
    return response.data
}

export const getFollowees = async() => {
    const response = await authorizedAxios.get<number[]>('/getFollowees')
    return response.data
}

export const getFollowRequests = async() => {
    const response = await authorizedAxios.get<number[]>('/getFollowRequests')
    return response.data
}