import { CurrentUserInfo } from './Interfaces'
import { importAccountKeysFromJwks, exportAccountKeysToJwks } from './auth'

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
            CurrentUser._info.accountKeys = await importAccountKeysFromJwks(CurrentUser._info.accountKeyPrivate!, CurrentUser._info.accountKeyPublic!)
        }
        return CurrentUser.info.accountKeys
    }

    static async set(info: CurrentUserInfo) {
        CurrentUser._info = info
        const [privateJwk, publicJwk] = await exportAccountKeysToJwks(info.accountKeys)
        CurrentUser._info.accountKeyPrivate = privateJwk
        CurrentUser._info.accountKeyPublic = publicJwk
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