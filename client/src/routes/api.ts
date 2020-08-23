import config from '../config'
import Axios from 'axios'
import {
    User,
    Post,
    EncryptedComment,
    DeletePostResult,
    StartPostResult,
    FinishPostResult,
    EncryptedPostKey,
    PublicKey,
    SentRequest,
} from '../../../backend/src/types/api'
import { queryCache } from 'react-query'
import { createKeysForNewFollower } from '../postCrypto'

const baseURL = `${config.serverUrl}/api`

const server = Axios.create({ withCredentials: true, baseURL })
server.interceptors.response.use(
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
    await server.put('/logout')
}

export async function getContentUrl() {
    const response = await server.get<string>('/getContentUrl')
    return response.data
}

export async function getHomePosts(key: string, pageIndex?: string) {
    const response = await server.get<Post[]>('/getHomePosts', {
        params: {
            pageIndex,
        },
    })
    return response.data
}

export async function getUserPosts(query: string, userId: number, pageIndex?: string) {
    const response = await server.get<Post[]>('/getUserPosts', {
        params: {
            userId,
            pageIndex,
        },
    })
    return response.data
}

export async function getPost(query: string, id: number) {
    const response = await server.get<Post>('getPost', {
        params: {
            id,
        },
    })
    return response.data
}

export async function getComments(id: number) {
    const response = await server.get<EncryptedComment[]>('getComments', {
        params: {
            id,
        },
    })
    return response.data
}

export async function createComment(comment: { postId: number; keySetId: number; content: string; contentIv: string }) {
    const response = await server.post('/createComment', {
        ...comment,
    })
    queryCache.invalidateQueries(['comments', comment.postId])
    return response.data
}

export async function deletePost(idTodelete: number) {
    const response = await server.delete<DeletePostResult>('/deletePost', {
        params: {
            id: idTodelete,
        },
    })
    queryCache.invalidateQueries('posts')
    return response.data
}

export async function getCurrentPostKey() {
    const response = await server.get<EncryptedPostKey | ''>('/getCurrentPostKey')
    if (response.data === '') return null
    return response.data
}

export async function createCurrentPostKey(keyBase64: string) {
    const response = await server.post<number>('/createCurrentPostKey', {
        key: keyBase64,
    })
    return response.data
}

export async function getKey(keySetId: number) {
    const response = await server.get<EncryptedPostKey | ''>('/getKey', {
        params: {
            keySetId,
        },
    })
    if (response.data === '') return null
    return response.data
}

export async function getAllPostKeys() {
    const response = await server.get<EncryptedPostKey[]>('/getAllPostKeys')
    return response.data
}

export async function addNewPostKeyForFollowers(keys: EncryptedPostKey[]) {
    await server.put('/addNewPostKeyForFollowers', {
        keys,
    })
}

export async function addOldPostKeysForFollower(keys: EncryptedPostKey[]) {
    await server.put('/addOldPostKeysForFollower', {
        keys,
    })
}

export async function getPublicKey(userId: number) {
    const response = await server.get<PublicKey>('/getPublicKey', {
        params: {
            userId,
        },
    })
    return response.data
}

export async function getFollowerPublicKeys() {
    const response = await server.get<PublicKey[]>('/getFollowerPublicKeys')
    return response.data
}

export async function startPost(keySetId: number, ivBase64: string, contentMD5Base64: string, aspect: number) {
    const postResponse = await server.post<StartPostResult>('/startPost', {
        keySetId,
        iv: ivBase64,
        md5: contentMD5Base64,
        aspect,
    })
    return postResponse.data
}

export async function finishPost(postId: number, success: boolean) {
    await server.put<FinishPostResult>('/finishPost', {
        postId,
        success,
    })
    queryCache.invalidateQueries('posts')
}

export async function getUser(key: string, userId: number) {
    const response = await server.get<User>('/getUserById', {
        params: { userId },
    })
    return response.data
}

export async function sendFollowRequest(friendCode: string) {
    await server.put('/sendFollowRequest', {
        friendCode,
    })
    queryCache.invalidateQueries('sentFollowRequests')
}

export async function sendFollowRequestDirect(userId: number) {
    await server.put('/sendFollowRequestDirect', {
        userId,
    })
    queryCache.invalidateQueries('sentFollowRequests')
}

export async function rejectFollowRequest(userId: number) {
    await server.put('/rejectFollowRequest', {
        userId,
    })
    queryCache.invalidateQueries('followRequests')
}

export async function unfollow(userId: number) {
    await server.put('/unfollow', {
        userId,
    })
    queryCache.invalidateQueries('followees')
    queryCache.invalidateQueries('posts')
    queryCache.invalidateQueries(['posts', userId])
}

export async function removeFollower(userId: number) {
    await server.put('/removeFollower', {
        userId,
    })
    queryCache.invalidateQueries('followers')
}

export async function acceptFollowRequest(userId: number) {
    await server.put('/acceptFollowRequest', {
        userId,
    })
    await createKeysForNewFollower(userId)
    queryCache.invalidateQueries('followers')
    queryCache.invalidateQueries('followRequests')
}

export async function getFollowers() {
    const response = await server.get<number[]>('/getFollowerIds')
    return response.data
}

export async function getFollowees() {
    const response = await server.get<number[]>('/getFollowees')
    return response.data
}

export async function getFollowRequests() {
    const response = await server.get<number[]>('/getFollowRequests')
    return response.data
}

export async function getSentFollowRequests() {
    const response = await server.get<SentRequest[]>('/getSentFollowRequests')
    return response.data
}

export async function getFriendCode() {
    const response = await server.get<string | null>('/getFriendCode')
    return response.data
}

export async function regenerateFriendCode() {
    const response = await server.post<string>('/regenerateFriendCode')
    queryCache.invalidateQueries('friendCode')
    return response.data
}
