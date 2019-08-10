import jwt from 'jsonwebtoken'

const kTokenKey = 'jwt'

class CurrentUser {
    static getToken() {
        return localStorage.getItem(kTokenKey)
    }

    static getPayload() {
        return jwt.decode(CurrentUser.getToken())
    }

    static setToken(token) {
        localStorage.setItem(kTokenKey, token)
    }

    static clearToken() {
        localStorage.clear(kTokenKey)
    }

    static loggedIn() {
        return localStorage.getItem(kTokenKey) !== null
    }
}

export default CurrentUser