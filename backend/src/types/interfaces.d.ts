export interface User {
    id: string,
    username: string,
}

export interface LoginUser {
    id: string,
    username: string,
    srpSalt: string,
    verifier: string,
}

export interface LoginInfo {
    user: LoginUser,
    clientEphemeralPublic: string,
    serverEphemeralSecret: string,
}

export interface SignupInfo {
    username: string,
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: User,
    }
}

declare global {
    namespace Express {
        interface Session {
            loginInfo?: LoginInfo,
            signupInfo?: SignupInfo,
        }
    }
}