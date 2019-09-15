export interface MessageCallback {
    (message : string) : void
}

export interface UserPasswordCombo {
    username : string,
    password : string,
}

export interface FollowRequest {
    requester_id : number,
}

export interface User {
    id : number,
    username : string,
}

export interface Post {
    id: number,
    filename : string,
    author_id : number,
    iv : string,
    key : JsonWebKey,
}