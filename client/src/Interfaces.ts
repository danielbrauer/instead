export interface MessageCallback {
    (message : string) : void
}

export interface UserPasswordCombo {
    username : string,
    password : string,
}

export interface FollowRequest {
    requesterId : string,
}

export interface User {
    _id : string,
    username : string,
}

export interface Post {
    _id : string,
    userid : string,
    iv : string,
    key : string,
}