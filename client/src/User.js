import jwt from 'jsonwebtoken'

const kTokenKey = 'jwt'

class User {
    static getToken() {
        return localStorage.getItem(kTokenKey)
    }

    static getPayload() {
        return jwt.decode(this.getToken())
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

export default User