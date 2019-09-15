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
        return jwt.decode(CurrentUser.getToken()!) as UserToken
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