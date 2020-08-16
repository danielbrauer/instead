import config from './config'
import Axios from 'axios'
import {
    User,
    Post,
    Comment,
    DeletePostResult,
    StartPostResult,
    FinishPostResult,
    EncryptedPostKey,
    PublicKey,
} from '../../backend/src/types/api'
import { queryCache } from 'react-query'
import { createKeysForNewFollower } from './postCrypto'

const baseURL = `${config.serverUrl}/api`

const authorizedAxios = Axios.create({ withCredentials: true, baseURL })
authorizedAxios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log('Not logged in')
            // this.goToLogin()
        } else if (error.response?.status === 400) {
            throw new Error(error.response.data)
        }
        Promise.reject(error)
    },
)

export async function logout() {
    await authorizedAxios.put('/logout')
}

export async function getContentUrl() {
    const response = await authorizedAxios.get<string>('/getContentUrl')
    return response.data
}

export async function getHomePosts() {
    const response = await authorizedAxios.get<Post[]>('/getHomePosts')
    return response.data
}

export async function getUserPosts(query: string, userId: number) {
    const response = await authorizedAxios.get<Post[]>('/getUserPosts', {
        params: {
            userId,
        },
    })
    return response.data
}

export async function getPost(query: string, id: number) {
    const response = await authorizedAxios.get<Post>('getPost', {
        params: {
            id,
        },
    })
    return response.data
}

export async function getComments(query: string, id: number) {
    const response = await authorizedAxios.get<Comment[]>('getComments', {
        params: {
            id,
        },
    })
    return response.data
}

export async function createComment(comment: { postId: number; keySetId: number; content: string; contentIv: string }) {
    const response = await authorizedAxios.post('/createComment', {
        ...comment,
    })
    queryCache.invalidateQueries(['comments', comment.postId])
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
    const response = await authorizedAxios.get<EncryptedPostKey | ''>('/getCurrentKey')
    if (response.data === '') return null
    return response.data
}

export async function createCurrentKey(keyBase64: string) {
    const response = await authorizedAxios.post<number>('/createCurrentKey', {
        key: keyBase64,
    })
    return response.data
}

export async function getKey(keySetId: number) {
    const response = await authorizedAxios.get<EncryptedPostKey | ''>('/getKey', {
        params: {
            keySetId,
        },
    })
    if (response.data === '') return null
    return response.data
}

export async function getAllKeys() {
    const response = await authorizedAxios.get<EncryptedPostKey[]>('/getAllKeys')
    return response.data
}

export async function addKeys(keys: EncryptedPostKey[]) {
    await authorizedAxios.put('/addKeys', {
        keys,
    })
}

export async function getPublicKey(userId: number) {
    const response = await authorizedAxios.get<PublicKey>('/getPublicKey', {
        params: {
            userId,
        },
    })
    return response.data
}

export async function getFollowerPublicKeys() {
    const response = await authorizedAxios.get<PublicKey[]>('/getFollowerPublicKeys')
    return response.data
}

export async function startPost(keySetId: number, ivBase64: string, contentMD5Base64: string, aspect: number) {
    const postResponse = await authorizedAxios.post<StartPostResult>('/startPost', {
        keyId: keySetId,
        iv: ivBase64,
        md5: contentMD5Base64,
        aspect,
    })
    return postResponse.data
}

export async function finishPost(postId: number, success: boolean) {
    await authorizedAxios.put<FinishPostResult>('/finishPost', {
        postId,
        success,
    })
}

export async function getUser(key: string, userId: number) {
    const response = await authorizedAxios.get<User>('/getUserById', {
        params: { userId },
    })
    return response.data
}

export async function sendFollowRequest(username: string) {
    await authorizedAxios.put('/sendFollowRequest', {
        username: username,
    })
}

export async function rejectFollowRequest(userId: number) {
    await authorizedAxios.put('/rejectFollowRequest', {
        userId,
    })
    queryCache.invalidateQueries('followRequests')
}

export async function unfollow(userId: number) {
    await authorizedAxios.put('/unfollow', {
        userId,
    })
    queryCache.invalidateQueries('followees')
}

export async function removeFollower(userId: number) {
    await authorizedAxios.put('/removeFollower', {
        userId,
    })
    queryCache.invalidateQueries('followers')
}

export async function acceptFollowRequest(userId: number) {
    await authorizedAxios.put('/acceptFollowRequest', {
        userId,
    })
    await createKeysForNewFollower(userId)
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
