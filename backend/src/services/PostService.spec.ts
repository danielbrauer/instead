import { mocked } from 'ts-jest/utils'
import * as Posts from '../queries/posts.gen'
import { IGetPostWithKeyResult } from '../queries/posts.gen'
import AWSService from './AWSService'
import DatabaseService from './DatabaseService'
import PostService from './PostService'

jest.mock('../queries/posts.gen')
jest.mock('../queries/comments.gen')
jest.mock('./DatabaseService')
jest.mock('./AWSService')

describe('PostService', () => {
    let postService: PostService
    let aws: AWSService
    let db: DatabaseService

    beforeAll(() => {
        db = new DatabaseService()
        aws = new AWSService()
        postService = new PostService(db, aws)
    })

    describe('getContentUrl', () => {
        test('gets url from AWS', () => {
            mocked(aws.s3ContentUrl).mockReturnValueOnce('test')
            const url = postService.getContentUrl()
            expect(url).toEqual('test')
        })
    })

    const testPost: IGetPostWithKeyResult = {
        id: 0,
        version: 0,
        encryptedInfo: null,
        authorId: 0,
        published: new Date(2012, 1),
        index: '0',
        filename: 'abcd',
        aspect: 1.2,
        postKeySetId: 0,
        key: 'someBase64',
        iv: 'moreBase64',
    }

    const secondPost: IGetPostWithKeyResult = {
        id: 1,
        version: 0,
        encryptedInfo: null,
        authorId: 1,
        published: new Date(2012, 2),
        index: '1',
        filename: 'abcd',
        aspect: 1.2,
        postKeySetId: 1,
        key: 'someBase64',
        iv: 'moreBase64',
    }

    describe('getPost', () => {
        test('gets one post with attached key', async () => {
            mocked(Posts.getPostWithKey.run).mockResolvedValueOnce([testPost])
            const post = await postService.getPost(0, 0)
            expect(post).toEqual(testPost)
        })

        test('returns null if there is none', async () => {
            mocked(Posts.getPostWithKey.run).mockResolvedValueOnce([])
            const post = await postService.getPost(0, 0)
            expect(post).toBeNull()
        })
    })

    describe('getHomePosts', () => {
        test('calls database and gets posts', async () => {
            mocked(Posts.getHomePostsWithKeys.run).mockResolvedValueOnce([testPost, secondPost])
            const posts = await postService.getHomePosts(0, '1')
            expect(mocked(Posts.getHomePostsWithKeys.run).mock.calls[0][0]).toEqual({
                recipientId: 0,
                pageIndex: '1',
            })
            expect(posts).toHaveLength(2)
        })
    })

    describe('getUserPosts', () => {
        test('calls database and gets posts', async () => {
            mocked(Posts.getUserPostsWithKeys.run).mockResolvedValueOnce([testPost])
            const posts = await postService.getUserPosts(0, 1)
            expect(mocked(Posts.getUserPostsWithKeys.run).mock.calls[0][0]).toEqual({
                userId: 0,
                recipientId: 1,
                pageIndex: undefined,
            })
            expect(posts).toHaveLength(1)
        })
    })
})
