export interface MessageCallback {
    (message : string) : void
}

export interface UserPasswordCombo {
    username : string,
    password : string,
}

export interface FollowRequest {
    requester_id : string,
}

export interface User {
    id : string,
    username : string,
}

export interface Post {
    id: string,
    filename : string,
    author_id : string,
    iv : string,
    key : JsonWebKey,
}