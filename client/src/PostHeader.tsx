import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import { useMutation } from 'react-query'
import { Post } from '../../backend/src/types/api'
import CurrentUser from './CurrentUser'
import { deletePost } from './routes/api'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'

dayjs.extend(relativeTime)

export default function PostHeader({ post }: { post: Post }) {
    const [deletePostMutation] = useMutation(deletePost)

    return (
        <div className='post-header'>
            <UserInList id={post.authorId} />
            <div className='timestamp'>{dayjs(post.published!).fromNow()}</div>
            {CurrentUser.getId() === post.authorId ? (
                <SafetyButton floated='right' size='mini' onClick={() => deletePostMutation(post.id)}>
                    Delete
                </SafetyButton>
            ) : null}
        </div>
    )
}
