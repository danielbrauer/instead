import React from 'react'
import { Message, Loader, Comment } from 'semantic-ui-react'
import { useQuery } from 'react-query'
import { getComments } from './postCrypto'
import SingleComment from './SingleComment'

export interface Props {
    postId: number
}

export default function (props: Props) {
    const commentsQuery = useQuery(['comments', props.postId], getComments)
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
        <Comment.Group>
            {commentsQuery.data!.map((comment) => (
                <SingleComment key={comment.id} comment={comment} />
            ))}
        </Comment.Group>
    )
}
