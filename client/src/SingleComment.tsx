import React from 'react'
import { Comment } from 'semantic-ui-react'
import * as Types from '../../backend/src/types/api'
import dayjs from './relativeTime'
import UserInList from './UserInList'

export default function ({ comment }: { comment: Types.Comment }) {
    return (
        <Comment>
            <Comment.Content>
                <UserInList id={comment.authorId} />
                <Comment.Metadata content={dayjs(comment.published).fromNow()} />
                <Comment.Text content={comment.content} />
            </Comment.Content>
        </Comment>
    )
}
