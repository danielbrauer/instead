
const kIdKey = 'userId'

class CurrentUser {

    static getId() : string {
        return localStorage.getItem(kIdKey) as string
    }

    static setId(id : string) {
        localStorage.setItem(kIdKey, id)
    }

    static clearId() {
        localStorage.removeItem(kIdKey)
    }

    static loggedIn() {
        return localStorage.getItem(kIdKey) !== null
    }
}

export default CurrentUser