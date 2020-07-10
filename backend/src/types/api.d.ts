import { IGetByAuthorIdResult } from "../queries/posts.gen"

export interface User {
    id: number
    username: string
}

export interface FollowRelationship {
    followerId: number
    followeeId: number
}

export interface ContentUrl {
    contentUrl: string
}

export interface ActionResult {
    success: boolean
}

export interface DeletePostResult extends ActionResult {}

export interface StartPostResult {
    signedRequest: string
    postId: number
}

export interface FinishPostResult extends ActionResult {}

export interface Post extends IGetByAuthorIdResult {

}