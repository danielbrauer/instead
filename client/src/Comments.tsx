import React from 'react'
import { Comment, Message, Loader, List } from 'semantic-ui-react'
import { useQuery } from 'react-query'
import { getComments } from './RoutesAuthenticated'

export interface Props {
    postId: number
}

export default function(props: Props) {
    const commentsQuery = useQuery(['comments', props.postId], getComments)
    if (commentsQuery.isError) return (
        <div>
            <Message negative>
                <Message.Header>Error fetching posts</Message.Header>
            </Message>
        </div>
    )
    if (commentsQuery.isLoading) return (
        <div>
            <Loader active></Loader>
        </div>
    )
    return (
        <div>
            {commentsQuery.data!.length === 0 ?
            null
            :
            <List>
                {commentsQuery.data!.map(comment => (
                    <List.Item key={comment.id}>
                        <Comment >{comment.contentIv}</Comment>
                    </List.Item>
                ))}
            </List>
            }
        </div>
    )
}