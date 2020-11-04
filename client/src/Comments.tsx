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
    if (commentsQuery.isError) return <Message negative header='Error fetching comments' />
    if (commentsQuery.isLoading)
        return <Loader className='comment-loader' active inline='centered' content='Loading comments...' />
    const { comments, fullCount } = commentsQuery.data!
    return (
        <Comment.Group className={compact ? 'compact' : undefined}>
            {comments.map((comment) => (
                <SingleComment key={comment.id} comment={comment} />
            ))}
            {limit && limit < fullCount ? (
                <Comment
                    className='see-comments-link'
                    content={
                        <InternalLink to={`/post/${postId.toString()}`}>See all {fullCount} comments</InternalLink>
                    }
                />
            ) : null}
        </Comment.Group>
    )
}
