import { mocked } from 'ts-jest/utils'
import PostService from './PostService'
import DatabaseService from './DatabaseService'
import AWSService from './AWSService'

jest.mock('../queries/posts.gen')
jest.mock('../queries/comments.gen')
jest.mock('./DatabaseService')
jest.mock('./AWSService')

describe('PostService', () => {

    let postService: PostService
    let aws: AWSService

    beforeAll(() => {
        const db = new DatabaseService()
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
})