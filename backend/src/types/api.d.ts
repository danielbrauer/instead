import * as Posts from '../queries/posts.gen'
import * as Keys from '../queries/keys.gen'
import * as Comments from '../queries/comments.gen'
import * as Users from '../queries/users.gen'
import * as FollowRequests from '../queries/follow_requests.gen'

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

export interface Comment {
    id: number
    authorId: number
    content: string
    published: Date
}

export type FinishPostResult = ActionResult

export type User = Users.IGetByIdResult

export type Post = Posts.IGetHomePostsWithKeysResult

export type EncryptedComment = Comments.IGetCommentsForPostResult

export type EncryptedPostKey = {
    key: string
    recipientId: number
    postKeySetId: number
}

export type PublicKey = Keys.IGetFollowerPublicKeysResult

export type SentRequest = FollowRequests.IGetByRequesterIdResult
