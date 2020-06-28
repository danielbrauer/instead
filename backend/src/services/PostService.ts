import { Service, Inject } from "typedi"
import Database from './DatabaseService'
import AWSService from './AWSService'
import * as Posts from '../queries/posts.gen'
import uuidv1 from 'uuid/v1'

@Service()
export default class PostService {

    @Inject()
    private db: Database

    @Inject()
    private aws: AWSService

    getS3ContentUrl() {
        return this.aws.s3ContentUrl()
    }

    async getPostsByAuthor(authorId: number) {
        return await Posts.getByAuthorId.run({ authorId }, this.db.pool)
    }

    async createPost(authorId: number, iv: string, key: string, fileType: string) {
        const fileName = uuidv1()
        const postPromise = Posts.create.run({ fileName, authorId, iv, key }, this.db.pool)
        const requestPromise = this.aws.s3GetSignedUploadUrl(fileName, fileType)
        const [signedRequest, ] = await Promise.all([requestPromise, postPromise])
        return { signedRequest, fileName }
    }

    async deletePost(postId: number, authorId: number) {
        const [deleted] = await Posts.destroyAndReturn.run({ postId, authorId }, this.db.pool)
        if (!deleted)
            throw new Error('Post not found')
        else
            await this.aws.s3DeleteObject(deleted.filename)
    }
}