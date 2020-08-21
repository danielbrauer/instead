import { User } from './api'
import { ICreateParams } from '../queries/users.gen'

export type StartLoginResult = {
    srpSalt: string
    serverEphemeralPublic: string
}

export type FinishLoginResult = {
    userId: number
    serverSessionProof: string
    displayName: string
    friendCode: string
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

export type NewUser = ICreateParams
