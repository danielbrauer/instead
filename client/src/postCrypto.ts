import * as Routes from './routes/api'
import { readAsArrayBuffer } from 'promise-file-reader'
import Axios from 'axios'
import CurrentUser from './CurrentUser'
import md5 from 'js-md5'
import { useReducer, useEffect } from 'react'
import { EncryptedPostKey, Post, Comment } from '../../backend/src/types/api'
const toBuffer = require('typedarray-to-buffer') as (typedArray: Uint8Array) => Buffer
require('buffer')
const Crypto = window.crypto
const kBinaryContentType = 'application/octet-stream'

interface PostKey {
    key: CryptoKey
    id: number
}

async function unwrapKeyAsymmetric(wrappedKeyBase64: string) {
    const accountKeys = await CurrentUser.getAccountKeys()
    const key = await Crypto.subtle.unwrapKey(
        'jwk',
        Buffer.from(wrappedKeyBase64, 'base64'),
        accountKeys.privateKey,
        { name: 'RSA-OAEP' },
        'AES-GCM',
        true,
        ['encrypt', 'decrypt'],
    )
    return key
}

async function wrapKeyAsymmetric(key: CryptoKey, wrappingKey: CryptoKey) {
    const arrayBuffer = await Crypto.subtle.wrapKey('jwk', key, wrappingKey, { name: 'RSA-OAEP' })
    return Buffer.from(arrayBuffer).toString('base64')
}

async function importPublicKey(jwk: JsonWebKey) {
    return await Crypto.subtle.importKey('jwk', jwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, [
        'encrypt',
        'wrapKey',
    ])
}

async function createEncryptedPostKey(postKey: CryptoKey, keySetId: number, publicKey: CryptoKey, userId: number) {
    const followerVersion = await wrapKeyAsymmetric(postKey, publicKey)
    const encryptedKey: EncryptedPostKey = {
        key: followerVersion,
        userId,
        keySetId,
    }
    return encryptedKey
}

export async function createKeysForNewFollower(userId: number) {
    const getAndImportPublicKey = async () => {
        const publicKey = await Routes.getPublicKey(userId)
        return await importPublicKey(publicKey.publicKey as JsonWebKey)
    }
    const [publicKey, postKeys] = await Promise.all([getAndImportPublicKey(), Routes.getAllKeys()])
    const followerPostKeyPromises = postKeys.map(
        async (encryptedPostKey): Promise<EncryptedPostKey> => {
            const postKey = await unwrapKeyAsymmetric(encryptedPostKey.key)
            return await createEncryptedPostKey(postKey, encryptedPostKey.keySetId, publicKey, userId)
        },
    )
    if (followerPostKeyPromises.length > 0) {
        const encryptedKeys = await Promise.all(followerPostKeyPromises)
        await Routes.addKeys(encryptedKeys)
    }
}

async function createPostKeyAndMakeCurrent(): Promise<PostKey> {
    const [postKey, accountKeys] = await Promise.all([
        Crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256,
            },
            true,
            ['encrypt', 'decrypt'],
        ),
        CurrentUser.getAccountKeys(),
    ])

    const [authorPostKey, followerPublicKeys] = await Promise.all([
        wrapKeyAsymmetric(postKey, accountKeys.publicKey),
        Routes.getFollowerPublicKeys(),
    ])

    const keySetId = await Routes.createCurrentKey(authorPostKey)

    const followerPostKeyPromises = followerPublicKeys.map(
        async (publicKey): Promise<EncryptedPostKey> => {
            const followerPublicKey = await importPublicKey(publicKey.publicKey as JsonWebKey)
            return await createEncryptedPostKey(postKey, keySetId, followerPublicKey, publicKey.id)
        },
    )

    if (followerPostKeyPromises.length > 0) {
        const encryptedKeys = await Promise.all(followerPostKeyPromises)
        await Routes.addKeys(encryptedKeys)
    }

    return {
        key: postKey,
        id: keySetId,
    }
}

async function getOrCreatePostKey(): Promise<PostKey> {
    const currentKeyEncrypted = await Routes.getCurrentKey()
    if (currentKeyEncrypted === null) return await createPostKeyAndMakeCurrent()
    const currentKey = await unwrapKeyAsymmetric(currentKeyEncrypted.key)
    return { id: currentKeyEncrypted.keySetId, key: currentKey }
}

async function encryptSymmetric(arrayBuffer: ArrayBuffer, key: CryptoKey) {
    const iv = Crypto.getRandomValues(new Uint8Array(12))
    const ivBuffer = toBuffer(iv)
    const encrypted = await Crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        key,
        arrayBuffer,
    )
    return { encrypted, ivBuffer }
}

export async function encryptAndUploadImage({ file, aspect }: { file: File; aspect: number }) {
    const [fileBuffer, postKey] = await Promise.all([readAsArrayBuffer(file), getOrCreatePostKey()])
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

export async function encryptAndPostComment({ post, content }: { post: Post; content: string }) {
    const postKey = await unwrapKeyAsymmetric(post.key)
    const contentBuffer = Buffer.from(content, 'utf8')
    const { encrypted, ivBuffer } = await encryptSymmetric(contentBuffer, postKey)
    await Routes.createComment({
        postId: post.id,
        keySetId: post.keySetId,
        content: Buffer.from(encrypted).toString('base64'),
        contentIv: ivBuffer.toString('base64'),
    })
    return true
}

export async function decryptSymmetric(buffer: ArrayBuffer, ivBase64: string, key: CryptoKey) {
    return await Crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: Buffer.from(ivBase64, 'base64'),
        },
        key,
        buffer,
    )
}

export async function getComments(query: string, postId: number) {
    const commentsEncrypted = await Routes.getComments(postId)
    const commentsDecrypted = Promise.all(
        commentsEncrypted.map(
            async (commentEnc): Promise<Comment> => {
                const postKey = await unwrapKeyAsymmetric(commentEnc.key)
                const decrypted = await decryptSymmetric(
                    Buffer.from(commentEnc.content, 'base64'),
                    commentEnc.contentIv,
                    postKey,
                )
                return {
                    id: commentEnc.id,
                    content: Buffer.from(decrypted).toString('utf8'),
                    authorId: commentEnc.authorId,
                    published: commentEnc.published,
                }
            },
        ),
    )
    return commentsDecrypted
}

type AsyncState = {
    results?: string
    isLoading: boolean
    error?: string
}

type AsyncAction = { type: 'request' } | { type: 'success'; results: string } | { type: 'failure'; error: string }

function asyncReducer(state: AsyncState, action: AsyncAction): AsyncState {
    switch (action.type) {
        case 'request':
            return { isLoading: true }
        case 'success':
            return { isLoading: false, results: action.results }
        case 'failure':
            return { isLoading: false, error: action.error }
    }
}

export function useEncryptedImage(wrappedKeyBase64: string, ivBase64: string, encryptedUrl: string) {
    const [state, dispatch] = useReducer(asyncReducer, { isLoading: false })

    useEffect(() => {
        let cancelRequest = false
        let decryptedUrl = ''
        if (!encryptedUrl) return

        const decrypt = async () => {
            dispatch({ type: 'request' })
            try {
                const [postKey, encryptedImage] = await Promise.all([
                    unwrapKeyAsymmetric(wrappedKeyBase64),
                    Axios.get<ArrayBuffer>(encryptedUrl, { responseType: 'arraybuffer' }),
                ])
                if (cancelRequest) return
                const decrypted = await decryptSymmetric(encryptedImage.data, ivBase64, postKey)
                if (cancelRequest) return
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
            if (decryptedUrl) URL.revokeObjectURL(decryptedUrl)
        }
    }, [encryptedUrl, ivBase64, wrappedKeyBase64])

    return state
}
