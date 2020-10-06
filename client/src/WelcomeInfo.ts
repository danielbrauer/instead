interface Info {
    username: string
    secretKey: string
}

class WelcomeInfo {
    private static _info?: Info

    private static get info(): Info {
        return WelcomeInfo._info!
    }

    static getUsername(): string {
        return WelcomeInfo.info.username
    }

    static getSecretKey(): string {
        return WelcomeInfo.info.secretKey
    }

    static set(info: Info) {
        WelcomeInfo._info = info
    }

    static clear() {
        delete WelcomeInfo._info
    }
}

export default WelcomeInfo
