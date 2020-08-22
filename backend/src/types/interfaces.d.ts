import { User } from 'api'

export interface LoginUser {
    id: number
    username: string
    srpSalt: string
    verifier: string
}

export interface LoginInfo {
    loginFake: boolean
    user?: LoginUser
    clientEphemeralPublic?: string
    serverEphemeralSecret?: string
}

declare module 'express-serve-static-core' {
    interface Request {
        userId?: number
        startTime?: number
    }
}

declare global {
    namespace Express {
        interface Session {
            loginInfo?: LoginInfo
            userId?: number
        }
    }
}
