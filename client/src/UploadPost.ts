import { startPost, finishPost } from "./RoutesAuthenticated"
import { readAsArrayBuffer } from 'promise-file-reader'
import Axios from "axios"
const toBuffer = require('typedarray-to-buffer')
require('buffer')
const md5 = require('js-md5')
const Crypto = window.crypto
const kBinaryContentType = 'application/octet-stream'

export const handleUpload = async (file: File) => {
    const filePromise = readAsArrayBuffer(file)
    const keyPromise = Crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    )
    const iv = Crypto.getRandomValues(new Uint8Array(12))
    const [result, key] = await Promise.all([filePromise, keyPromise])
    const ivBuffer = toBuffer(iv)
    const encrypted = await Crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        result
    )
    const contentMD5 = md5.base64(encrypted)
    const exportedKey = await Crypto.subtle.exportKey(
        "jwk",
        key
    )
    const postInfo = await startPost(exportedKey, ivBuffer.toString('base64'), contentMD5)
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