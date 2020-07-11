import { CurrentUserInfo } from "./Interfaces"

const kSecretKeyKey = 'secretKey'

class CurrentUser {

    private static info: CurrentUserInfo

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
        return CurrentUser.info.secretKey || localStorage.getItem(kSecretKeyKey)
    }

    static getAccountKeys() : CryptoKeyPair {
        return CurrentUser.info.accountKeys
    }

    static set(info: CurrentUserInfo) {
        CurrentUser.info = info
        localStorage.setItem(kSecretKeyKey, info.secretKey)
    }

    static clear() {
        delete CurrentUser.info
    }

    static clearSecretKey() {
        localStorage.removeItem(kSecretKeyKey)
    }

    static loggedIn() {
        return CurrentUser.info !== null
    }
}

export default CurrentUser