
const kIdKey = 'userId'
const kUsernameKey = 'username'
const kSecretKeyKey = 'secretKey'

class CurrentUser {

    static getId() : number {
        return parseInt(localStorage.getItem(kIdKey)!, 10)
    }

    static getUsername() : string {
        return localStorage.getItem(kUsernameKey)!
    }

    static getSecretKey() : string | null {
        return localStorage.getItem(kSecretKeyKey)
    }

    static set(id : number, username : string, secretKey : string) {
        localStorage.setItem(kIdKey, id.toString())
        localStorage.setItem(kUsernameKey, username)
        localStorage.setItem(kSecretKeyKey, secretKey)
    }

    static clear() {
        localStorage.removeItem(kIdKey)
        localStorage.removeItem(kUsernameKey)
    }

    static clearSecretKey() {
        localStorage.removeItem(kSecretKeyKey)
    }

    static loggedIn() {
        return localStorage.getItem(kIdKey) !== null
    }
}

export default CurrentUser