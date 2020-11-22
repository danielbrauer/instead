import Axios from 'axios'
import { queryCache } from 'react-query'
import * as Types from '../../../backend/src/types/api'
import config from '../config'
import CurrentUser from '../CurrentUser'
import { createKeysForNewFollower, createProfileKeyForViewer } from '../postCrypto'

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
    const response = await server.get<Types.Post[]>('/getHomePosts', {
        params: {
            pageIndex,
        },
    })
    return response.data
}

export async function getUserPosts(query: string, userId: number, pageIndex?: string) {
    const response = await server.get<Types.Post[]>('/getUserPosts', {
        params: {
            userId,
            pageIndex,
        },
    })
    return response.data
}

export async function getPost(query: string, id: number) {
    const response = await server.get<Types.Post>('getPost', {
        params: {
            id,
        },
    })
    return response.data
}

export async function getComments(id: number, limit: number) {
    const response = await server.get<Types.EncryptedComment[]>('getComments', {
        params: {
            id,
            limit,
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

export async function getActivity() {
    const response = await server.get<Types.ActivityItem[]>('/activity')
    return response.data
}

export async function getActivityCount() {
    const response = await server.get<number>('/activityCount')
    return response.data
}

export async function setActivityLastCheckedDate() {
    const response = await server.post('/activityLastCheckedDate')
    queryCache.invalidateQueries('activityCount')
    return response.data
}

export async function deletePost(idTodelete: number) {
    const response = await server.delete<Types.DeletePostResult>('/deletePost', {
        params: {
            id: idTodelete,
        },
    })
    queryCache.invalidateQueries('posts')
    return response.data
}

export async function getCurrentPostKey() {
    const response = await server.get<Types.EncryptedPostKey | ''>('/getCurrentPostKey')
    if (response.data === '') return null
    return response.data
}

export async function createCurrentPostKey(keyBase64: string) {
    const response = await server.post<number>('/createCurrentPostKey', {
        key: keyBase64,
    })
    return response.data
}

export async function getPostKey(keySetId: number) {
    const response = await server.get<Types.EncryptedPostKey | ''>('/getPostKey', {
        params: {
            keySetId,
        },
    })
    if (response.data === '') return null
    return response.data
}

export async function getAllPostKeys() {
    const response = await server.get<Types.EncryptedPostKey[]>('/getAllPostKeys')
    return response.data
}

export async function addPostKeys(keys: Types.EncryptedPostKey[]) {
    await server.put('/addPostKeys', {
        keys,
    })
}

export async function getPublicKey(userId: number) {
    const response = await server.get<Types.PublicKey>('/getPublicKey', {
        params: {
            userId,
        },
    })
    return response.data
}

export async function getFollowerPublicKeys() {
    const response = await server.get<Types.PublicKey[]>('/getFollowerPublicKeys')
    return response.data
}

export async function startPost(postKeySetId: number, ivBase64: string, contentMD5Base64: string, encryptedInfoBase64: string) {
    const postResponse = await server.post<Types.StartPostResult>('/startPost', {
        postKeySetId,
        iv: ivBase64,
        md5: contentMD5Base64,
        encryptedInfo: encryptedInfoBase64,
    })
    return postResponse.data
}

export async function finishPost(postId: number, success: boolean) {
    await server.put<Types.FinishPostResult>('/finishPost', {
        postId,
        success,
    })
    queryCache.invalidateQueries('posts')
}

export async function getUserProfile(userId: number) {
    const response = await server.get<Types.EncryptedUserProfile>('/getUserProfile', {
        params: { userId },
    })
    return response.data || null
}

export async function setProfile(displayNameBase64: string, displayNameIvBase64: string) {
    await server.put('/setProfile', {
        displayName: displayNameBase64,
        displayNameIv: displayNameIvBase64,
    })
    queryCache.invalidateQueries(['userProfile', CurrentUser.getId()])
}

export async function sendFollowRequest(friendCode: string) {
    const response = await server.put<number>('/sendFollowRequest', {
        friendCode,
    })
    await createProfileKeyForViewer(response.data)
    queryCache.invalidateQueries('sentFollowRequests')
}

export async function sendFollowRequestDirect(userId: number) {
    await server.put('/sendFollowRequestDirect', {
        userId,
    })
    await createProfileKeyForViewer(userId)
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

export async function getFollowRequestCount() {
    const response = await server.get<number>('/getFollowRequestCount')
    return response.data
}

export async function getFollowRequests() {
    const response = await server.get<number[]>('/getFollowRequests')
    return response.data
}

export async function getSentFollowRequests() {
    const response = await server.get<Types.SentRequest[]>('/getSentFollowRequests')
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

export async function getCurrentProfileKey() {
    const response = await server.get<Types.EncryptedProfileKey>('/getCurrentProfileKey')
    return response.data || null
}

export async function getProfileViewersPublicKeys() {
    const response = await server.get<Types.ProfileViewerKeyInfo[]>('/getProfileViewersPublicKeys')
    return response.data
}

export async function createProfileKey(keyBase64: string) {
    await server.post('/createProfileKey', {
        ownerKey: keyBase64,
    })
}

export async function addProfileKeys(viewerKeys: Types.EncryptedProfileViewerKey[]) {
    await server.post('/addProfileKeys', {
        viewerKeys,
    })
}

export async function addOrReplaceProfileKey(viewerKey: Types.EncryptedProfileViewerKey) {
    await server.post('/addOrReplaceProfileKey', {
        viewerKey,
    })
}
