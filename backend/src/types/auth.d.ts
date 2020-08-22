import { ICreateParams } from '../queries/users.gen'

export type StartLoginResult = {
    srpSalt: string
    serverEphemeralPublic: string
}

export type FinishLoginResult = {
    userId: number
    serverSessionProof: string
    privateKey: string
    privateKeyIv: string
    publicKey: JsonWebKey
    mukSalt: string
}

export type NewUser = ICreateParams
