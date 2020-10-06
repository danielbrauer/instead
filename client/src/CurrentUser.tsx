import { exportAccountKeysToJwks, importAccountKeysFromJwks, LoginResult } from './auth'
import { EncryptedSecretKey } from './Interfaces'

export interface CurrentUserInfo extends LoginResult {
    accountKeysJwk?: {
        privateKey: JsonWebKey
        publicKey: JsonWebKey
    }
}

const kUserInfoKey = 'userInfoKey'
const kOldUnencryptedSecretKeyKey = 'secretKey'
const kEncryptedSecretKeyKey = 'secretKeyEnc'

class CurrentUser {
    private static _info?: CurrentUserInfo

    private static get info(): CurrentUserInfo {
        if (!CurrentUser._info) {
            const sessionUser = sessionStorage.getItem(kUserInfoKey)
            if (sessionUser) {
                CurrentUser._info = JSON.parse(sessionUser)
            }
        }
        return CurrentUser._info!
    }

    static getId(): number {
        return CurrentUser.info.id
    }

    static getUsername(): string {
        return CurrentUser.info.username
    }

    static async getAccountKeys() {
        if ((CurrentUser.info.accountKeys.privateKey as any).kty === undefined)
            CurrentUser._info!.accountKeys = await importAccountKeysFromJwks(CurrentUser._info!.accountKeysJwk!)
        return CurrentUser.info.accountKeys
    }

    static getOldSecretKey() {
        return localStorage.getItem(kOldUnencryptedSecretKeyKey)
    }

    static setEncryptedSecretKey(encryptedSecretKey: EncryptedSecretKey) {
        localStorage.setItem(kEncryptedSecretKeyKey, JSON.stringify(encryptedSecretKey))
        localStorage.removeItem(kOldUnencryptedSecretKeyKey)
    }

    static getEncryptedSecretKey() {
        const keyJson = localStorage.getItem(kEncryptedSecretKeyKey)
        return keyJson ? (JSON.parse(keyJson) as EncryptedSecretKey) : null
    }

    static async set(info: CurrentUserInfo, saveKey: boolean) {
        CurrentUser._info = info
        const accountKeysJwk = await exportAccountKeysToJwks(CurrentUser._info.accountKeys)
        CurrentUser._info.accountKeysJwk = accountKeysJwk
        sessionStorage.setItem(kUserInfoKey, JSON.stringify(CurrentUser._info))
        if (saveKey) {
            CurrentUser.setEncryptedSecretKey(CurrentUser._info.encryptedSecretKey)
        }
    }

    static clear() {
        delete CurrentUser._info
        sessionStorage.clear()
    }

    static clearSecretKey() {
        localStorage.removeItem(kEncryptedSecretKeyKey)
        localStorage.removeItem(kOldUnencryptedSecretKeyKey)
    }

    static loggedIn() {
        return CurrentUser.info !== undefined
    }
}

export default CurrentUser
