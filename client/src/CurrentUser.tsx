import { CurrentUserInfo } from "./Interfaces"
const Crypto = window.crypto

const kUserInfoKey = 'userInfoKey'
const kSecretKeyKey = 'secretKey'

class CurrentUser {

    private static _info: CurrentUserInfo

    private static get info() : CurrentUserInfo {
        if (!CurrentUser._info) {
            const sessionUser = sessionStorage.getItem(kUserInfoKey)
            if (sessionUser) {
                CurrentUser._info = JSON.parse(sessionUser)
            }
        }
        return CurrentUser._info
    }

    static getId() : number {
        return CurrentUser.info.id
    }

    static getUsername() : string {
        return CurrentUser.info.username
    }

    static getDisplayName() : string {
        return CurrentUser.info.displayName
    }

    static getSecretKey() : string | null {
        return (CurrentUser.info && CurrentUser.info.secretKey) || localStorage.getItem(kSecretKeyKey)
    }

    static async getAccountKeys() {
        if ((CurrentUser.info.accountKeys.privateKey as any).kty === undefined) {
            const privateKeyPromise = Crypto.subtle.importKey(
                'jwk',
                CurrentUser._info.accountKeyPrivate!,
                { name: 'RSA-OAEP', hash: 'SHA-256' },
                true,
                ['decrypt', 'unwrapKey']
            )
            const publicKeyPromise = Crypto.subtle.importKey(
                'jwk',
                CurrentUser._info.accountKeyPublic!,
                { name: 'RSA-OAEP', hash: 'SHA-256' },
                true,
                ['encrypt', 'wrapKey']
            )
            const [privateKey, publicKey] = await Promise.all([privateKeyPromise, publicKeyPromise])
            CurrentUser._info.accountKeys = {
                privateKey, publicKey
            }
        }
        return CurrentUser.info.accountKeys
    }

    static async set(info: CurrentUserInfo) {
        CurrentUser._info = info
        info.accountKeyPrivate = await Crypto.subtle.exportKey(
            'jwk',
            info.accountKeys.privateKey
        )
        info.accountKeyPublic = await Crypto.subtle.exportKey(
            'jwk',
            info.accountKeys.publicKey
        )
        sessionStorage.setItem(kUserInfoKey, JSON.stringify(info))
        localStorage.setItem(kSecretKeyKey, info.secretKey)
    }

    static clear() {
        delete CurrentUser._info
        sessionStorage.clear()
    }

    static clearSecretKey() {
        localStorage.removeItem(kSecretKeyKey)
    }

    static loggedIn() {
        return CurrentUser.info !== undefined
    }
}

export default CurrentUser