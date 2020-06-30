import { Service, Inject } from "typedi"
import Database from './DatabaseService'
import AWSService from './AWSService'
import * as Posts from '../queries/posts.gen'
import uuidv1 from 'uuid/v1'
import { EventDispatcher } from 'event-dispatch'
import Events from '../types/events'

@Service()
export default class PostService {

    @Inject()
    private db: Database

    @Inject()
    private aws: AWSService

    private dispatcher : EventDispatcher

    constructor() {
        this.dispatcher = new EventDispatcher()
    }

    getContentUrl() {
        return this.aws.s3ContentUrl()
    }

    async getPostsByAuthor(authorId: number) {
        return await Posts.getByAuthorId.run({ authorId }, this.db.pool)
    }

    async createPost(authorId: number, iv: string, key: string) {
        const fileName = uuidv1()
        const postPromise = Posts.createAndReturn.run({ fileName, authorId, iv, key }, this.db.pool)
        const requestPromise = this.aws.s3GetSignedUploadUrl(fileName, 'application/octet-stream')
        const [signedRequest, [post]] = await Promise.all([requestPromise, postPromise])
        this.dispatcher.dispatch(Events.post.created, { postId: post.id })
        return { signedRequest, fileName }
    }

    async deletePost(postId: number, authorId: number) {
        const [deleted] = await Posts.destroyAndReturn.run({ postId, authorId }, this.db.pool)
        if (!deleted) {
            throw new Error('Post not found')
        } else {
            await this.aws.s3DeleteObject(deleted.filename)
            this.dispatcher.dispatch(Events.post.created, { postId: deleted.id })
        }
    }
}