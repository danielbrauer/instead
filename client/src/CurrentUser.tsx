
const kIdKey = 'userId'
const kUsernameKey = 'username'
const kSecretKeyKey = 'secretKey'
const kDisplayNameKey = 'displayName'

class CurrentUser {

    static getId() : number {
        return parseInt(localStorage.getItem(kIdKey)!, 10)
    }

    static getUsername() : string {
        return localStorage.getItem(kUsernameKey)!
    }

    static getDisplayName() : string {
        return localStorage.getItem(kDisplayNameKey)!
    }

    static getSecretKey() : string | null {
        return localStorage.getItem(kSecretKeyKey)
    }

    static set(id : number, username : string, secretKey : string, displayName : string) {
        localStorage.setItem(kIdKey, id.toString())
        localStorage.setItem(kUsernameKey, username)
        localStorage.setItem(kDisplayNameKey, displayName)

        localStorage.setItem(kSecretKeyKey, secretKey)
    }

    static clear() {
        localStorage.removeItem(kIdKey)
        localStorage.removeItem(kUsernameKey)
        localStorage.removeItem(kDisplayNameKey)
    }

    static clearSecretKey() {
        localStorage.removeItem(kSecretKeyKey)
    }

    static loggedIn() {
        return localStorage.getItem(kIdKey) !== null
    }
}

export default CurrentUser