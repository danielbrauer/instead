import { IGetHomePostsWithKeysResult } from "../queries/posts.gen"
import { IGetFollowerPublicKeysResult, IGetCurrentKeyResult} from "../queries/keys.gen"
import { IGetCommentsForPostResult } from "../queries/comments.gen"

export interface User {
    id: number
    username: string
}

export interface FollowRelationship {
    followerId: number
    followeeId: number
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

export interface Post extends IGetHomePostsWithKeysResult {}

export interface Comment extends IGetCommentsForPostResult {}

export interface EncryptedPostKey extends IGetCurrentKeyResult {}

export interface PublicKey extends IGetFollowerPublicKeysResult {}