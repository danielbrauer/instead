export interface User {
    id: string,
    username: string,
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: User,
    }
}
