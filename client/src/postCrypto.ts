import Axios from 'axios'
import md5 from 'js-md5'
import { readAsArrayBuffer } from 'promise-file-reader'
import { useEffect, useReducer } from 'react'
import * as Types from '../../backend/src/types/api'
import { PostInfo } from '../../backend/src/types/api'
import CurrentUser from './CurrentUser'
import * as Routes from './routes/api'
import sizeOfImage from 'image-size'
import Pica from 'pica'
import ImageBlobReduce from 'image-blob-reduce'
const typedArrayToBuffer = require('typedarray-to-buffer') as (typedArray: Uint8Array) => Buffer
require('buffer')
const Crypto = window.crypto
const kBinaryContentType = 'application/octet-stream'
const pica = Pica({ features: [ 'js', 'wasm' ]})
const reducer = ImageBlobReduce({pica})

interface PostKey {
    key: CryptoKey
    id: number
}

export interface ImageInfo {
    width: number
    height: number
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

async function createEncryptedPostKey(
    postKey: CryptoKey,
    postKeySetId: number,
    publicKey: CryptoKey,
    recipientId: number,
) {
    const followerVersion = await wrapKeyAsymmetric(postKey, publicKey)
    const encryptedKey: Types.EncryptedPostKey = {
        key: followerVersion,
        recipientId,
        postKeySetId,
    }
    return encryptedKey
}

export async function createKeysForNewFollower(userId: number) {
    await Promise.all([createPostKeysForNewFollower(userId), createProfileKeyForViewer(userId)])
}

export async function createProfileKeyForViewer(userId: number) {
    const profileKey = await Routes.getCurrentProfileKey()
    if (profileKey) {
        const [viewerPublicKey, profileKeyUnwrapped] = await Promise.all([
            Routes.getPublicKey(userId),
            unwrapKeyAsymmetric(profileKey.key),
        ])
        const encrypted = await encryptProfileKeyForViewer(viewerPublicKey, profileKeyUnwrapped)
        Routes.addOrReplaceProfileKey(encrypted)
    }
}

async function createPostKeysForNewFollower(userId: number) {
    const getAndImportPublicKey = async () => {
        const publicKey = await Routes.getPublicKey(userId)
        return await importPublicKey(publicKey.publicKey as JsonWebKey)
    }
    const [publicKey, postKeys] = await Promise.all([getAndImportPublicKey(), Routes.getAllPostKeys()])
    if (postKeys.length === 0) return
    const followerPostKeyPromises = postKeys.map(
        async (encryptedPostKey): Promise<Types.EncryptedPostKey> => {
            const postKey = await unwrapKeyAsymmetric(encryptedPostKey.key)
            return await createEncryptedPostKey(postKey, encryptedPostKey.postKeySetId, publicKey, userId)
        },
    )
    const encryptedKeys = await Promise.all(followerPostKeyPromises)
    await Routes.addPostKeys(encryptedKeys)
}

async function generateSymmetricKey(): Promise<CryptoKey> {
    return await Crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    )
}

async function createPostKeyAndMakeCurrent(): Promise<PostKey> {
    const [postKey, accountKeys, followerPublicKeys] = await Promise.all([
        generateSymmetricKey(),
        CurrentUser.getAccountKeys(),
        Routes.getFollowerPublicKeys(),
    ])

    const authorPostKey = await wrapKeyAsymmetric(postKey, accountKeys.publicKey)

    const keySetId = await Routes.createCurrentPostKey(authorPostKey)

    const followerPostKeyPromises = followerPublicKeys.map(
        async (publicKey): Promise<Types.EncryptedPostKey> => {
            const followerPublicKey = await importPublicKey(publicKey.publicKey as JsonWebKey)
            return await createEncryptedPostKey(postKey, keySetId, followerPublicKey, publicKey.id)
        },
    )

    if (followerPostKeyPromises.length > 0) {
        const encryptedKeys = await Promise.all(followerPostKeyPromises)
        await Routes.addPostKeys(encryptedKeys)
    }

    return {
        key: postKey,
        id: keySetId,
    }
}

async function getOrCreatePostKey(): Promise<PostKey> {
    const currentKeyEncrypted = await Routes.getCurrentPostKey()
    if (currentKeyEncrypted === null) return await createPostKeyAndMakeCurrent()
    const currentKey = await unwrapKeyAsymmetric(currentKeyEncrypted.key)
    return { id: currentKeyEncrypted.postKeySetId, key: currentKey }
}

async function encryptSymmetric(arrayBuffer: ArrayBuffer, key: CryptoKey, ivBuffer?: Buffer) {
    if (!ivBuffer) {
        const iv = Crypto.getRandomValues(new Uint8Array(12))
        ivBuffer = typedArrayToBuffer(iv)
    }
    const encrypted = await Crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: ivBuffer,
        },
        key,
        arrayBuffer,
    )
    return { encrypted, ivBuffer }
}

async function postCommentWithKey({ postId, postKey, comment }: { postId: number; postKey: PostKey; comment: string }) {
    const contentBuffer = Buffer.from(comment, 'utf8')
    const { encrypted, ivBuffer } = await encryptSymmetric(contentBuffer, postKey.key)
    await Routes.createComment({
        postId: postId,
        keySetId: postKey.id,
        content: Buffer.from(encrypted).toString('base64'),
        contentIv: ivBuffer.toString('base64'),
    })
    return true
}

const minMipSize = 32

async function createMipsAndEncrypt(original: File) {
    const dimensions = sizeOfImage(Buffer.from(await readAsArrayBuffer(original)))
    const postKey = await getOrCreatePostKey()
    const postInfo: PostInfo = {
        aspect: dimensions.height!/dimensions.width!,
        imageSizes: []
    }
    const wideImage = postInfo.aspect < 1
    const maxDimension = wideImage ? dimensions.width! : dimensions.height!
    let mipSize = maxDimension
    let ivBuffer: Buffer | undefined
    let byteOffset = 0
    let buffers: Buffer[] = []
    while (mipSize >= minMipSize || buffers.length === 0) {
        console.log(mipSize)
        const mip = await reducer.toBlob(original, {max: mipSize})
        console.log('reduced')
        const mipBuffer = await readAsArrayBuffer(mip)
        const { encrypted: encryptedMip, ivBuffer: returnedIvBuffer } = await encryptSymmetric(mipBuffer, postKey.key, ivBuffer)
        console.log('encrypted')
        ivBuffer = returnedIvBuffer
        postInfo.imageSizes.push({
            width: wideImage ? mipSize : Math.round(mipSize/postInfo.aspect),
            height: wideImage ? Math.round(mipSize*postInfo.aspect) : mipSize,
            byteOffset,
            byteLength: encryptedMip.byteLength
        })
        buffers.push(Buffer.from(encryptedMip))
        mipSize = Math.floor(mipSize*0.5)
        byteOffset += encryptedMip.byteLength
    }
    const serialBlob = Buffer.concat(buffers, byteOffset)
    return { serialBlob, postInfo, postKey, ivBuffer }
}

export async function encryptAndUploadImage({
    file,
    comment,
}: {
    file: File
    comment?: string
}) {
    const { serialBlob, postInfo, postKey, ivBuffer } = await createMipsAndEncrypt(file)
    const contentMD5 = md5.base64(serialBlob)
    const encryptedPostInfo = await encryptSymmetric(Buffer.from(JSON.stringify(postInfo)), postKey.key, ivBuffer)
    const postStartResult = await Routes.startPost(postKey.id, ivBuffer!.toString('base64'), contentMD5, Buffer.from(encryptedPostInfo.encrypted).toString('base64'))
    const signedRequest = postStartResult.signedRequest

    const options = {
        headers: {
            'Content-Type': kBinaryContentType,
            'Content-MD5': contentMD5,
        },
    }
    let success = true
    try {
        await Axios.put(signedRequest, serialBlob, options)
    } catch (error) {
        success = false
    }
    await Routes.finishPost(postStartResult.postId, success)

    if (comment) {
        await postCommentWithKey({ postId: postStartResult.postId, postKey, comment })
    }

    return success
}

export async function encryptAndPostComment({ post, comment }: { post: Types.Post; comment: string }) {
    const key = await unwrapKeyAsymmetric(post.key)
    const postKey: PostKey = { key, id: post.postKeySetId }
    return await postCommentWithKey({ postId: post.id, postKey, comment })
}

async function decryptSymmetric(buffer: ArrayBuffer, ivBase64: string, key: CryptoKey) {
    return await Crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: Buffer.from(ivBase64, 'base64'),
        },
        key,
        buffer,
    )
}

export async function getComments(query: string, postId: number, limit: number) {
    const commentsEncrypted = await Routes.getComments(postId, limit)
    const commentsDecrypted = await Promise.all(
        commentsEncrypted.map(
            async (commentEnc): Promise<Types.Comment> => {
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
    const fullCount = commentsEncrypted.length > 0 ? commentsEncrypted[0].fullCount! : 0
    return { comments: commentsDecrypted, fullCount }
}

async function encryptProfileKeyForViewer(
    viewer: Types.PublicKey,
    profileKey: CryptoKey,
): Promise<Types.EncryptedProfileViewerKey> {
    const viewerPublicKey = await importPublicKey(viewer.publicKey as JsonWebKey)
    const viewerVersion = await wrapKeyAsymmetric(profileKey, viewerPublicKey)
    const encryptedKey: Types.EncryptedProfileViewerKey = {
        key: viewerVersion,
        recipientId: viewer.id,
        ownerId: CurrentUser.getId(),
    }
    return encryptedKey
}

async function createProfileKey(): Promise<CryptoKey> {
    const [publicKeys, newKey, accountKeys] = await Promise.all([
        Routes.getProfileViewersPublicKeys(),
        generateSymmetricKey(),
        CurrentUser.getAccountKeys(),
    ])
    const ownerWrappedKey = await wrapKeyAsymmetric(newKey, accountKeys.publicKey)
    await Routes.createProfileKey(ownerWrappedKey)
    if (publicKeys.length > 0) {
        const viewerWrappedKeys = await Promise.all(
            publicKeys.map((publicKey) => encryptProfileKeyForViewer(publicKey, newKey)),
        )
        await Routes.addProfileKeys(viewerWrappedKeys)
    }
    return newKey
}

async function getOrCreateProfileKey(): Promise<CryptoKey> {
    const currentKey = await Routes.getCurrentProfileKey()
    let currentKeyDec: CryptoKey
    if (currentKey && !currentKey.profileKeyStale) {
        currentKeyDec = await unwrapKeyAsymmetric(currentKey.key)
    } else {
        currentKeyDec = await createProfileKey()
    }
    return currentKeyDec
}

export async function encryptAndUploadProfile(displayName: string) {
    const profileKey = await getOrCreateProfileKey()
    const { encrypted, ivBuffer } = await encryptSymmetric(Buffer.from(displayName, 'utf-8'), profileKey)
    await Routes.setProfile(Buffer.from(encrypted).toString('base64'), ivBuffer.toString('base64'))
}

export async function getProfile(query: string, userId: number) {
    const profileEncrypted = await Routes.getUserProfile(userId)
    if (!profileEncrypted || !profileEncrypted.displayName) return null
    const profileKey = await unwrapKeyAsymmetric(profileEncrypted.key)
    const profileDecrypted = await decryptSymmetric(
        Buffer.from(profileEncrypted.displayName, 'base64'),
        profileEncrypted.displayNameIv!,
        profileKey,
    )
    return Buffer.from(profileDecrypted).toString('utf8')
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

function getClosestImageSize(imageSizes: Types.ImageSize[], desiredSize: number | undefined): Types.ImageSize {
    let chosenIndex = 0 // Starting at the big end
    if (desiredSize) { // choose the next smallest image if it's at least as big as the desired size
        while (chosenIndex < imageSizes.length - 1 && imageSizes[chosenIndex + 1].width >= desiredSize) {
            ++chosenIndex
        }
    }
    return imageSizes[chosenIndex]
}

export function useEncryptedImage(wrappedKeyBase64: string, ivBase64: string, encryptedPostInfo: string | null, encryptedUrl: string, desiredSize: number | undefined) {
    const [state, dispatch] = useReducer(asyncReducer, { isLoading: false })

    useEffect(() => {
        let cancelRequest = false
        let decryptedUrl = ''
        if (!encryptedUrl) return

        const decrypt = async () => {
            dispatch({ type: 'request' })
            try {
                const postKey = await unwrapKeyAsymmetric(wrappedKeyBase64)
                let range: string | undefined
                if (encryptedPostInfo) {
                    const decryptedInfo = await decryptSymmetric(Buffer.from(encryptedPostInfo, 'base64'), ivBase64, postKey)
                    const postInfo: PostInfo = JSON.parse(Buffer.from(decryptedInfo).toString('utf-8'))
                    const imageSize = getClosestImageSize(postInfo.imageSizes, desiredSize)
                    range = `bytes=${imageSize.byteOffset}-${imageSize.byteOffset+imageSize.byteLength-1}`
                }
                const encryptedImage = await Axios.get<ArrayBuffer>(encryptedUrl, { responseType: 'arraybuffer', headers: {'Range': range} })
                if (cancelRequest) return
                const decrypted = await decryptSymmetric(encryptedImage.data, ivBase64, postKey)
                if (cancelRequest) return
                const blob = new Blob([decrypted], { type: 'image/jpeg' })
                decryptedUrl = URL.createObjectURL(blob)
                dispatch({ type: 'success', results: decryptedUrl })
                return
            } catch (error) {
                console.log(error)
                dispatch({ type: 'failure', error })
            }
        }

        decrypt()

        return () => {
            cancelRequest = true
            if (decryptedUrl) URL.revokeObjectURL(decryptedUrl)
        }
    }, [encryptedUrl, ivBase64, wrappedKeyBase64, encryptedPostInfo, desiredSize])

    return state
}
