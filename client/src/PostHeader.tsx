import React from 'react'
import { Post } from '../../backend/src/types/api'
import dayjs from './relativeTime'
import UserInList from './UserInList'

export default function PostHeader({ post }: { post: Post }) {
    return (
        <div className='post-header'>
            <UserInList id={post.authorId} />
            <div className='timestamp'>{dayjs(post.published!).fromNow()}</div>
        </div>
    )
}
