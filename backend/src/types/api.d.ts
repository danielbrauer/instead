import { IGetHomePostsWithKeysResult } from '../queries/posts.gen'
import { IGetFollowerPublicKeysResult, IGetKeyResult } from '../queries/keys.gen'
import { IGetCommentsForPostResult } from '../queries/comments.gen'
import { IGetByIdResult } from '../queries/users.gen'

export interface FollowRelationship {
    followerId: number
    followeeId: number
}

export interface ActionResult {
    success: boolean
}

export type DeletePostResult = ActionResult

export interface StartPostResult {
    signedRequest: string
    postId: number
}

export type FinishPostResult = ActionResult

export type User = IGetByIdResult

export type Post = IGetHomePostsWithKeysResult

export type Comment = IGetCommentsForPostResult

export type EncryptedPostKey = IGetKeyResult

export type PublicKey = IGetFollowerPublicKeysResult
