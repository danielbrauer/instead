import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import { Post } from '../../backend/src/types/api'
import UserInList from './UserInList'

dayjs.extend(relativeTime)

export default function PostHeader({ post }: { post: Post }) {
    return (
        <div className='post-header'>
            <UserInList id={post.authorId} />
            <div className='timestamp'>{dayjs(post.published!).fromNow()}</div>
        </div>
    )
}
