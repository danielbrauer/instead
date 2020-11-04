import React from 'react'
import { useQuery } from 'react-query'
import { Comment, Loader, Message } from 'semantic-ui-react'
import InternalLink from './Components/InternalLink'
import { getComments } from './postCrypto'
import SingleComment from './SingleComment'

interface CommentsProps {
    postId: number
    limit?: number
    compact?: boolean
}

export default function ({ postId, limit, compact }: CommentsProps) {
    const commentsQuery = useQuery(['comments', postId, limit], getComments)
    if (commentsQuery.isError)
        return (
            <div>
                <Message negative>
                    <Message.Header>Error fetching posts</Message.Header>
                </Message>
            </div>
        )
    if (commentsQuery.isLoading)
        return (
            <div>
                <Loader active></Loader>
            </div>
        )
    const { comments, fullCount } = commentsQuery.data!
    return (
        <Comment.Group className={'post-metadata' + (compact ? ' compact' : '')}>
            {comments.map((comment) => (
                <SingleComment key={comment.id} comment={comment} />
            ))}
            {limit && limit < fullCount ? (
                <Comment>
                    <Comment.Content>
                        <InternalLink to={`/post/${postId.toString()}`}>See all {fullCount} comments</InternalLink>
                    </Comment.Content>
                </Comment>
            ) : null}
        </Comment.Group>
    )
}
