import { User } from "api"

export interface LoginUser {
    id: number;
    username: string;
    srp_salt: string;
    verifier: string;
    display_name: string;
}

export interface LoginInfo {
    loginFake: boolean,
    user?: LoginUser,
    clientEphemeralPublic?: string,
    serverEphemeralSecret?: string,
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
            loginInfo?: LoginInfo
            signupInfo?: SignupInfo
            user?: User
        }
    }
}