
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

export async function logout() {
    await authorizedAxios.get('/logout')
}

export async function getContentUrl() {
    const response = await authorizedAxios.get<string>('/getContentUrl')
    return response.data
}

export async function getPosts() {
    const response = await authorizedAxios.get<Post[]>('/getPosts')
    return response.data
}

export async function deletePost(idTodelete: number) {
    const response = await authorizedAxios.delete<DeletePostResult>('/deletePost', {
        params: {
            id: idTodelete,
        },
    })
    queryCache.invalidateQueries('posts')
    return response.data
}

export async function getCurrentKey() {
    const response = await authorizedAxios.get<EncryptedPostKey>('/getCurrentKey')
    return response.data
}

export async function startPost(exportedKey: JsonWebKey, ivBase64: string, contentMD5Base64: string) {
    const postResponse = await authorizedAxios.post<StartPostResult>('/startPost', {
        key: exportedKey,
        iv: ivBase64,
        md5: contentMD5Base64
    })
    return postResponse.data
}

export async function finishPost(postId: number, success: boolean) {
    await authorizedAxios.post<FinishPostResult>('/finishPost', {
        postId,
        success
    })
}

export async function getUser(key: string, userid: number) {
    const response = await authorizedAxios.get<User>('/getUserById', {
        params: {userid: userid}
    })
    return response.data
}

export async function sendFollowRequest(username: string) {
    await authorizedAxios.post('/sendFollowRequest', {
        username: username,
    })
}

export async function rejectFollowRequest(userid: number) {
    await authorizedAxios.post('/rejectFollowRequest', {
        userid: userid
    })
    queryCache.invalidateQueries('followRequests')
}

export async function unfollow(userid: number) {
    await authorizedAxios.post('/unfollow', {
        userid: userid
    })
    queryCache.invalidateQueries('followees')
}

export async function removeFollower(userid: number) {
    await authorizedAxios.post('/removeFollower', {
        userid: userid
    })
    queryCache.invalidateQueries('followers')
}

export async function acceptFollowRequest(userid: number) {
    await authorizedAxios.post('/acceptFollowRequest', {
        userid: userid
    })
    queryCache.invalidateQueries('followers')
    queryCache.invalidateQueries('followRequests')
}

export async function getFollowers() {
    const response = await authorizedAxios.get<number[]>('/getFollowerIds')
    return response.data
}

export async function getFollowees() {
    const response = await authorizedAxios.get<number[]>('/getFollowees')
    return response.data
}

export async function getFollowRequests() {
    const response = await authorizedAxios.get<number[]>('/getFollowRequests')
    return response.data
}