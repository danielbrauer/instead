import * as Routes from './RoutesAuthenticated'
import { readAsArrayBuffer } from 'promise-file-reader'
import Axios from 'axios'
import CurrentUser from './CurrentUser'
import md5 from 'js-md5'
import { useReducer, useEffect } from 'react'
import { EncryptedPostKey } from '../../backend/src/types/api'
const toBuffer = require('typedarray-to-buffer') as (typedArray: Uint8Array) => Buffer
require('buffer')
const Crypto = window.crypto
const kBinaryContentType = 'application/octet-stream'

interface PostKey {
    key: CryptoKey
    id: number
}

async function unwrapKey(wrappedKey: EncryptedPostKey | null) {
    if (wrappedKey === null)
        return null
    const accountKeys = await CurrentUser.getAccountKeys()
    const key = await Crypto.subtle.unwrapKey(
        'jwk',
        Buffer.from(wrappedKey.key, 'base64'),
        accountKeys.privateKey,
        { name: 'RSA-OAEP'},
        'AES-GCM',
        true,
        ['encrypt', 'decrypt']
    )
    return {
        key,
        id: wrappedKey.keySetId,
    }
}

async function getCurrentPostKey() : Promise<PostKey | null> {
    const encrypted = await Routes.getCurrentKey()
    return await unwrapKey(encrypted)
}

async function getPostKey(keySetId: number) : Promise<PostKey | null> {
    const encrypted = await Routes.getKey(keySetId)
    return await unwrapKey(encrypted)
}

async function createPostKeyAndMakeCurrent() : Promise<PostKey> {
    const [postKey, accountKeys] = await Promise.all([
        Crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        ),
        CurrentUser.getAccountKeys()
    ])

    const [authorPostKey, followerPublicKeys] = await Promise.all([
        Crypto.subtle.wrapKey(
            'jwk',
            postKey,
            accountKeys.publicKey,
            { name: 'RSA-OAEP' }
        ),
        Routes.getFollowerPublicKeys()
    ])

    const keySetId = await Routes.createCurrentKey(Buffer.from(authorPostKey).toString('base64'))

    const followerPostKeyPromises = followerPublicKeys.map(async(publicKey): Promise<EncryptedPostKey> => {
        const followerPublicKey = await Crypto.subtle.importKey(
            'jwk',
            publicKey.publicKey as JsonWebKey,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ['encrypt', 'wrapKey']
        )
        const followerVersion = await Crypto.subtle.wrapKey(
            'jwk',
            postKey,
            followerPublicKey,
            { name: 'RSA-OAEP' }
        )
        const encryptedKey: EncryptedPostKey = {
            key: Buffer.from(followerVersion).toString('base64'),
            userId: publicKey.id,
            keySetId: keySetId,
        }
        return encryptedKey
    })

    if (followerPostKeyPromises.length > 0) {
        const encryptedKeys = await Promise.all(followerPostKeyPromises)
        await Routes.addKeys(encryptedKeys)
    }

    return {
        key: postKey,
        id: keySetId,
    }
}

async function getOrCreatePostKey() {
    let currentKey = await getCurrentPostKey()
    if (currentKey === null)
        currentKey = await createPostKeyAndMakeCurrent()
    return currentKey
}

async function encryptSymmetric(buffer: ArrayBuffer, key: CryptoKey) {
    const iv = Crypto.getRandomValues(new Uint8Array(12))
    const ivBuffer = toBuffer(iv)
    const encrypted = await Crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        buffer
    )
    return { encrypted, ivBuffer }
}

export async function encryptAndUploadImage({file, aspect} : {file: File, aspect: number}) {
    const [fileBuffer, postKey] = await Promise.all([
        readAsArrayBuffer(file),
        getOrCreatePostKey()
    ])
    const { encrypted, ivBuffer } = await encryptSymmetric(fileBuffer, postKey.key)
    const contentMD5 = md5.base64(encrypted)
    const postInfo = await Routes.startPost(postKey.id, ivBuffer.toString('base64'), contentMD5, aspect)
    const signedRequest = postInfo.signedRequest

    const options = {
        headers: {
            'Content-Type': kBinaryContentType,
            'Content-MD5': contentMD5,
        },
    }
    let success = true
    try {
        await Axios.put(signedRequest, encrypted, options)
    } catch (error) {
        success = false
    }
    await Routes.finishPost(postInfo.postId, success)
    return success
}

export async function encryptAndPostComment(comment: { postId: number, keySetId: number, content: string }) {
    const postKey = await getPostKey(comment.keySetId)
    const contentBuffer = Buffer.from(comment.content, 'utf8')
    const { encrypted, ivBuffer } = await encryptSymmetric(contentBuffer, postKey!.key)
    await Routes.createComment({
        postId: comment.postId,
        keySetId: comment.keySetId,
        content: Buffer.from(encrypted).toString('base64'),
        contentIv: ivBuffer.toString('base64')
    })
    return true
}

type EncryptedImageState = {
    decryptedUrl?: string
    isLoading: boolean
    error?: string
}

type EncryptedImageAction =
    | { type: 'request' }
    | { type: 'success', results: string }
    | { type: 'failure', error: string }

export function useEncryptedImage(wrappedKeyBase64: string, ivBase64: string, encryptedUrl: string) {

    function reducer(state: EncryptedImageState, action: EncryptedImageAction): EncryptedImageState {
        switch (action.type) {
            case 'request':
                return { isLoading: true };
            case 'success':
                return { isLoading: false, decryptedUrl: action.results };
            case 'failure':
                return { isLoading: false, error: action.error };
        }
    }
    const [state, dispatch] = useReducer(reducer, { isLoading: false })

    useEffect(() => {
        let cancelRequest = false
        let decryptedUrl = ''
        if (!encryptedUrl)
            return

        const decrypt = async() => {
            dispatch({ type: 'request' })
            try {
                const accountKeys = await CurrentUser.getAccountKeys()
                if (cancelRequest)
                    return
                const [cryptoKey, encryptedImage] = await Promise.all([
                    Crypto.subtle.unwrapKey(
                        'jwk',
                        Buffer.from(wrappedKeyBase64, 'base64'),
                        accountKeys.privateKey,
                        { name: 'RSA-OAEP' },
                        { name: 'AES-GCM' },
                        false,
                        ['encrypt', 'decrypt'],
                    ),
                    Axios.get(
                        encryptedUrl,
                        { responseType: 'arraybuffer' }
                    )
                ])
                if (cancelRequest)
                    return
                const decrypted = await Crypto.subtle.decrypt(
                    {
                        name: 'AES-GCM',
                        iv: Buffer.from(ivBase64, 'base64'),
                    },
                    cryptoKey,
                    encryptedImage.data,
                )
                if (cancelRequest)
                    return
                const blob = new Blob([decrypted], { type: 'image/jpeg' })
                decryptedUrl = URL.createObjectURL(blob)
                dispatch({ type: 'success', results: decryptedUrl })
                return
            } catch (error) {
                dispatch({ type: 'failure', error })
            }
        }

        decrypt()

        return () => {
            cancelRequest = true
            if (decryptedUrl)
                URL.revokeObjectURL(decryptedUrl)
        }

    }, [encryptedUrl, ivBase64, wrappedKeyBase64])

    return state
}
