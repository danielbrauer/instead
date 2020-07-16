import { startPost, finishPost, getCurrentKey, getFollowerPublicKeys, createCurrentKey, addKeys } from "./RoutesAuthenticated"
import { readAsArrayBuffer } from 'promise-file-reader'
import Axios from "axios"
import CurrentUser from "./CurrentUser"
import md5 from 'js-md5'
import { useRef, useReducer, useEffect } from "react"
const toBuffer = require('typedarray-to-buffer') as (typedArray: Uint8Array) => Buffer
require('buffer')
const Crypto = window.crypto
const kBinaryContentType = 'application/octet-stream'

interface PostKey {
    key: CryptoKey
    id: number
}

async function getCurrentPostKey() : Promise<PostKey | null> {
    const encrypted = await getCurrentKey()
    if (encrypted === null)
        return null
    const key = await Crypto.subtle.unwrapKey(
        'jwk',
        Buffer.from(encrypted.jwk, 'base64'),
        CurrentUser.getAccountKeys().privateKey,
        { name: 'RSA-OAEP'},
        'AES-GCM',
        true,
        ['encrypt', 'decrypt']
    )
    return {
        key,
        id: encrypted.key_set_id,
    }
}

async function createNewCurrentPostKey() : Promise<PostKey> {
    const key = await Crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    )

    const userVersion = await Crypto.subtle.wrapKey(
        'jwk',
        key,
        CurrentUser.getAccountKeys().publicKey,
        { name: 'RSA-OAEP' }
    )

    const keySetId = await createCurrentKey(Buffer.from(userVersion).toString('base64'))

    const followerKeys = await getFollowerPublicKeys()

    const keyPromises = followerKeys.map(async(publicKey) => {
        const followerPublicKey = await Crypto.subtle.importKey(
            'jwk',
            publicKey.public_key as JsonWebKey,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ['encrypt']
        )
        const followerVersion = await Crypto.subtle.wrapKey(
            'jwk',
            key,
            followerPublicKey,
            { name: 'RSA-OAEP' }
        )
        return {
            jwk: Buffer.from(followerVersion).toString('base64'),
            user_id: publicKey.id,
            key_set_id: keySetId,
        }
    })

    const encryptedKeys = await Promise.all(keyPromises)

    await addKeys(encryptedKeys)

    return {
        key,
        id: keySetId,
    }
}

export async function handleUpload(file: File) {
    const filePromise = readAsArrayBuffer(file)
    const keyPromise = getCurrentPostKey()
    const iv = Crypto.getRandomValues(new Uint8Array(12))
    const [result, currentKey] = await Promise.all([filePromise, keyPromise])
    let postKey = currentKey
    if (postKey === null)
        postKey = await createNewCurrentPostKey()
    const ivBuffer = toBuffer(iv)
    const encrypted = await Crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        postKey.key,
        result
    )
    const contentMD5 = md5.base64(encrypted)
    const postInfo = await startPost(postKey.id, ivBuffer.toString('base64'), contentMD5)
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
    await finishPost(postInfo.postId, success)
    return success
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
        if (!encryptedUrl)
            return

        const decrypt = async() => {
            dispatch({ type: 'request' })
            try {
                const [cryptoKey, encryptedImage] = await Promise.all([
                    Crypto.subtle.unwrapKey(
                        'jwk',
                        Buffer.from(wrappedKeyBase64, 'base64'),
                        CurrentUser.getAccountKeys().privateKey,
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
                const decryptedUrl = URL.createObjectURL(blob)
                dispatch({ type: 'success', results: decryptedUrl })
                return
            } catch (error) {
                dispatch({ type: 'failure', error })
            }
        }

        decrypt()

        return () => {
            cancelRequest = true
            if (state.decryptedUrl)
                URL.revokeObjectURL(state.decryptedUrl)
        }

    }, [encryptedUrl])

    return state
}