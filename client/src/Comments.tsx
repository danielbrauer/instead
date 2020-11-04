import React from 'react'
import { useQuery } from 'react-query'
import { Comment, Loader, Message } from 'semantic-ui-react'
import './Comments.css'
import { getComments } from './postCrypto'
import SingleComment from './SingleComment'

interface CommentsProps {
    postId: number
    limit: number
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
    return (
        <Comment.Group className={compact ? 'compact' : undefined}>
            {commentsQuery.data!.map((comment) => (
                <SingleComment key={comment.id} comment={comment} />
            ))}
        </Comment.Group>
    )
}
