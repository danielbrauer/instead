import { DeletePostResult, PostUpgradeResult, StartPostResult } from 'api'
import { SimpleEventDispatcher } from 'strongly-typed-events'
import Container, { Service } from 'typedi'
import uuidv1 from 'uuid/v1'
import config from '../config/config'
import * as Activity from '../queries/activity.gen'
import * as Comments from '../queries/comments.gen'
import * as Posts from '../queries/posts.gen'
import * as PostUpgrades from '../queries/post_upgrades.gen'
import AWSService from './AWSService'
import Database from './DatabaseService'

@Service()
export default class PostService {
    private _onCreate = new SimpleEventDispatcher<number>()
    private _onDelete = new SimpleEventDispatcher<number>()

    public get onCreate() {
        return this._onCreate.asEvent()
    }
    public get onDelete() {
        return this._onDelete.asEvent()
    }

    constructor(private db: Database, private aws: AWSService) {
        this.onCreate.subscribe(this.onPostCreated)
    }

    getContentUrl(): string {
        return this.aws.s3ContentUrl()
    }

    async getHomePosts(recipientId: number, pageIndex?: string) {
        return await Posts.getHomePostsWithKeys.run({ recipientId, pageIndex }, this.db.pool)
    }

    async getUserPosts(userId: number, recipientId: number, pageIndex?: string) {
        return await Posts.getUserPostsWithKeys.run(
            { userId, recipientId, pageIndex },
            this.db.pool,
        )
    }

    async getPost(postId: number, recipientId: number) {
        const [post] = await Posts.getPostWithKey.run({ postId, recipientId }, this.db.pool)
        return post || null
    }

    async deletePost(postId: number, authorId: number): Promise<DeletePostResult> {
        const [deleted] = await Posts.destroyAndReturn.run({ postId, authorId }, this.db.pool)
        if (!deleted) {
            throw new Error('Post not found')
        } else {
            await this.aws.s3DeleteObject(deleted.filename)
            this._onDelete.dispatchAsync(deleted.id)
        }
        return { success: true }
    }

    async createPost(
        authorId: number,
        postKeySetId: number,
        iv: string,
        md5: string,
        encryptedInfo: string,
    ): Promise<StartPostResult> {
        const fileName = uuidv1()
        const [signedRequest, [{ id: postId }]] = await Promise.all([
            this.aws.s3GetSignedUploadUrl(fileName, 'application/octet-stream', md5),
            Posts.createAndReturn.run(
                { fileName, authorId, postKeySetId, iv, encryptedInfo },
                this.db.pool,
            ),
        ])
        this._onCreate.dispatchAsync(postId)
        return { signedRequest, postId }
    }

    async publishPost(postId: number) {
        await Posts.publish.run({ postId }, this.db.pool)
        return { success: true }
    }

    async createPostUpgrade(
        postId: number,
        md5: string,
        encryptedInfo: string,
    ): Promise<PostUpgradeResult> {
        const version = 1
        const fileName = uuidv1()
        const [signedRequest, [{ id: postUpgradeId }]] = await Promise.all([
            this.aws.s3GetSignedUploadUrl(fileName, 'application/octet-stream', md5),
            PostUpgrades.createAndReturn.run(
                { postId, encryptedInfo, fileName, version },
                this.db.pool,
            ),
        ])
        return { signedRequest, postUpgradeId }
    }

    async applyPostUpgrade(upgradeId: number) {
        await PostUpgrades.applyAndDelete.run({ upgradeId }, this.db.pool)
    }

    async removePostIfNotPublished(postId: number) {
        await Posts.destroyIfUnpublished.run({ postId }, this.db.pool)
    }

    async addCommentToPost(comment: Comments.ICreateParams) {
        await Comments.create.run(comment, this.db.pool)
    }

    async removeComment(commentId: number, authorId: number) {
        await Comments.destroy.run({ commentId, authorId }, this.db.pool)
    }

    async getCommentsForPost(postId: number, userId: number, limit?: number) {
        return await Comments.getCommentsForPost.run({ postId, userId, limit }, this.db.pool)
    }

    async getActivity(userId: number, pageIndex?: string) {
        return await Activity.getActivityForUser.run({ userId, pageIndex }, this.db.pool)
    }

    async getActivityCount(userId: number) {
        const [{ count }] = await Activity.getRecentActivityCount.run({ userId }, this.db.pool)
        return count
    }

    onPostCreated(postId: number) {
        setTimeout(
            () => Container.get(PostService).removePostIfNotPublished(postId),
            (config.int('UPLOAD_TIME') + 1) * 1000,
        )
    }
}
