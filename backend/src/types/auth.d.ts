import { User } from './api'

export type StartLoginResult = {
    srpSalt: string
    serverEphemeralPublic: string
}

export type FinishLoginResult = {
    userid: number
    serverSessionProof: string
    displayName: string
    privateKey: string
    privateKeyIv: string
    publicKey: JsonWebKey
    mukSalt: string
}

export type StartSignupResult = {
    username: string
}

export type FinishSignupResult = {
    user: User
}