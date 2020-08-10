import React from 'react'
import * as Types from '../../backend/src/types/api'
import { Comment } from 'semantic-ui-react'
import moment from 'moment'
import { useQuery } from 'react-query'
import { getUser } from './RoutesAuthenticated'

export default function(props: {comment: Types.Comment}) {
    const userQuery = useQuery(['users', props.comment.authorId], getUser)
    return (
        <Comment>
            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
            <Comment.Content>
                <Comment.Author as='a' content={userQuery.isSuccess ? userQuery.data.username : 'User'} />
                <Comment.Metadata content={moment(props.comment.published).fromNow()} />
                <Comment.Text content={props.comment.content} />
            </Comment.Content>
        </Comment>
    )
}