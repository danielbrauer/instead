import Container, { Service, Inject } from "typedi"
import Database from './DatabaseService'
import AWSService from './AWSService'
import * as Posts from '../queries/posts.gen'
import uuidv1 from 'uuid/v1'
import { SimpleEventDispatcher } from 'strongly-typed-events'
import config from '../config/config'

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

    getContentUrl() {
        return this.aws.s3ContentUrl()
    }

    async removePostIfNotPublished(postId: number) {
        await Posts.destroyIfUnpublished.run({ postId }, this.db.pool)
    }

    onPostCreated(postId: number) {
        setTimeout(() => Container.get(PostService).removePostIfNotPublished(postId), (config.uploadTime + 1)*1000)
    }

    async getPostsByAuthor(authorId: number) {
        return await Posts.getByAuthorId.run({ authorId }, this.db.pool)
    }

    async createPost(authorId: number, iv: string, key: string, md5: string) {
        const fileName = uuidv1()
        const postPromise = Posts.createAndReturn.run({ fileName, authorId, iv, key }, this.db.pool)
        const requestPromise = this.aws.s3GetSignedUploadUrl(fileName, 'application/octet-stream', md5)
        const [signedRequest, [{id: postId}]] = await Promise.all([requestPromise, postPromise])
        this._onCreate.dispatchAsync(postId)
        return { signedRequest, postId }
    }

    async publishPost(postId: number) {
        return await Posts.publish.run({ postId }, this.db.pool)
    }

    async deletePost(postId: number, authorId: number) {
        const [deleted] = await Posts.destroyAndReturn.run({ postId, authorId }, this.db.pool)
        if (!deleted) {
            throw new Error('Post not found')
        } else {
            await this.aws.s3DeleteObject(deleted.filename)
            this._onDelete.dispatchAsync(deleted.id)
        }
    }
}