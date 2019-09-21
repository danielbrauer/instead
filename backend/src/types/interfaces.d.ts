export interface User {
    id: string,
    username: string,
}

export interface TokenPayload {
    userid: string,
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: User,
        tokenPayload?: TokenPayload,
    }
}
