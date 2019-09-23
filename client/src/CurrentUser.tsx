
const kIdKey = 'userId'

class CurrentUser {

    static getId() : number {
        return parseInt(localStorage.getItem(kIdKey) as string, 10)
    }

    static setId(id : number) {
        localStorage.setItem(kIdKey, id.toString())
    }

    static clearId() {
        localStorage.removeItem(kIdKey)
    }

    static loggedIn() {
        return localStorage.getItem(kIdKey) !== null
    }
}

export default CurrentUser