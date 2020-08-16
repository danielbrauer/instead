import React from 'react'
import * as Types from '../../backend/src/types/api'
import { Comment } from 'semantic-ui-react'
import moment from 'moment'
import UserInList from './UserInList'

export default function ({ comment }: { comment: Types.Comment }) {
    return (
        <Comment>
            <Comment.Content>
                <UserInList id={comment.authorId} />
                <Comment.Metadata content={moment(comment.published).fromNow()} />
                <Comment.Text content={comment.content} />
            </Comment.Content>
        </Comment>
    )
}
