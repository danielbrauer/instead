import { mocked } from 'ts-jest/utils'
import PostService from './PostService'
import DatabaseService from './DatabaseService'
import AWSService from './AWSService'
import * as Posts from '../queries/posts.gen'
import { IGetPostWithKeyResult } from '../queries/posts.gen'

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
        authorId: 0,
        published: new Date(2012, 1),
        filename: 'abcd',
        aspect: 1.2,
        keySetId: 0,
        key: 'someBase64',
        iv: 'moreBase64'
    }

    describe('getPost', () => {
        test('gets one post with attached key', async() => {
            mocked(Posts.getPostWithKey.run).mockResolvedValueOnce([testPost])
            const post = await postService.getPost(0, 0)
            expect(post).toEqual(testPost)
        })

        test('returns null if there is none', async() => {
            mocked(Posts.getPostWithKey.run).mockResolvedValueOnce([])
            const post = await postService.getPost(0, 0)
            expect(post).toBeNull()
        })
    })
})