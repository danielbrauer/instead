const kTokenKey = 'jwt'

class User {
    static getToken() {
        return localStorage.getItem(kTokenKey)
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

module.exports = User