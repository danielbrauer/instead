interface Info {
    username: string
    displayName: string
}

const kWelcomeInfoKey = 'welcomeInfoKey'

class WelcomeInfo {

    private static _info: Info

    private static get info() : Info {
        if (!WelcomeInfo._info) {
            const sessionUser = sessionStorage.getItem(kWelcomeInfoKey)
            if (sessionUser) {
                WelcomeInfo._info = JSON.parse(sessionUser)
            }
        }
        return WelcomeInfo._info
    }

    static getUsername() : string {
        return WelcomeInfo.info.username
    }

    static getDisplayName() : string {
        return WelcomeInfo.info.displayName
    }

    static set(info: Info) {
        sessionStorage.setItem(kWelcomeInfoKey, JSON.stringify(info))
    }

    static clear() {
        delete WelcomeInfo._info
        sessionStorage.removeItem(kWelcomeInfoKey)
    }
}

export default WelcomeInfo