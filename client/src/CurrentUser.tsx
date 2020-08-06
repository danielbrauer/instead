import { importAccountKeysFromJwks, exportAccountKeysToJwks } from './auth'

interface CurrentUserInfo {
    id: number
    username: string
    displayName: string
    secretKey: string
    accountKeys: CryptoKeyPair
    accountKeysJwk?: {
        privateKey: JsonWebKey,
        publicKey: JsonWebKey
    }
}

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
        if ((CurrentUser.info.accountKeys.privateKey as any).kty === undefined)
            CurrentUser._info.accountKeys = await importAccountKeysFromJwks(CurrentUser._info.accountKeysJwk!)
        return CurrentUser.info.accountKeys
    }

    static async set(info: CurrentUserInfo) {
        CurrentUser._info = info
        const accountKeysJwk = await exportAccountKeysToJwks(info.accountKeys)
        CurrentUser._info.accountKeysJwk = accountKeysJwk
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