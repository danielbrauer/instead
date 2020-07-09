export type StartLoginResult = {
    srpSalt: string
    serverEphemeralPublic: string
}

export type FinishLoginResult = {
    userid: number
    serverSessionProof: string
    displayName: string
}

export type StartSignupResult = {
    username: string
}