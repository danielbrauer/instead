import jwt from 'jsonwebtoken'

const kTokenKey = 'jwt'

interface UserToken {
    userid : number
}

class CurrentUser {
    static getToken() {
        return localStorage.getItem(kTokenKey)
    }

    static getPayload() : UserToken {
        const decoded = jwt.decode(CurrentUser.getToken()!)
        return decoded as UserToken
    }

    static setToken(token : string) {
        localStorage.setItem(kTokenKey, token)
    }

    static clearToken() {
        localStorage.removeItem(kTokenKey)
    }

    static loggedIn() {
        return localStorage.getItem(kTokenKey) !== null
    }
}

export default CurrentUser