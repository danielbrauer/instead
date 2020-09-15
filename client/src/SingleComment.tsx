import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import { Comment } from 'semantic-ui-react'
import * as Types from '../../backend/src/types/api'
import UserInList from './UserInList'

dayjs.extend(relativeTime)

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
