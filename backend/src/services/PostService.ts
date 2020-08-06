import Container, { Service, Inject } from 'typedi'
import Database from './DatabaseService'
import AWSService from './AWSService'
import * as Posts from '../queries/posts.gen'
import uuidv1 from 'uuid/v1'
import { SimpleEventDispatcher } from 'strongly-typed-events'
import * as config from '../config/config'
import { DeletePostResult, StartPostResult } from 'api'

@Service()
export default class PostService {

    @Inject()
    private db: Database

    @Inject()
    private aws: AWSService

    private _onCreate = new SimpleEventDispatcher<number>()
    private _onDelete = new SimpleEventDispatcher<number>()

    public get onCreate() { return this._onCreate.asEvent() }
    public get onDelete() { return this._onDelete.asEvent() }

    constructor() {
        this.onCreate.subscribe(this.onPostCreated)
    }

    getContentUrl(): string {
        return this.aws.s3ContentUrl()
    }

    async getPostsByAuthor(authorId: number) {
        return await Posts.getHomePostsWithKeys.run({ authorId }, this.db.pool)
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

    async createPost(authorId: number, keySetId: number, iv: string, md5: string, aspect: number): Promise<StartPostResult> {
        const fileName = uuidv1()
        const [signedRequest, [{id: postId}]] = await Promise.all([
            this.aws.s3GetSignedUploadUrl(fileName, 'application/octet-stream', md5),
            Posts.createAndReturn.run({ fileName, authorId, keySetId, iv, aspect }, this.db.pool)
        ])
        this._onCreate.dispatchAsync(postId)
        return { signedRequest, postId }
    }

    async publishPost(postId: number) {
        await Posts.publish.run({ postId }, this.db.pool)
        return { success: true }
    }

    async removePostIfNotPublished(postId: number) {
        await Posts.destroyIfUnpublished.run({ postId }, this.db.pool)
    }

    onPostCreated(postId: number) {
        setTimeout(() => Container.get(PostService).removePostIfNotPublished(postId), (config.int('UPLOAD_TIME') + 1)*1000)
    }
}