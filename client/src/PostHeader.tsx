import React from 'react'
import CurrentUser from './CurrentUser'
import { Post } from '../../backend/src/types/api'
import { useMutation } from 'react-query'
import { deletePost } from './routes/api'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'

export default function PostHeader({ post }: { post: Post }) {
    const [deletePostMutation] = useMutation(deletePost)

    return (
        <div>
            <UserInList id={post.authorId} />
            {CurrentUser.getId() === post.authorId ? (
                <SafetyButton floated='right' size='mini' onClick={() => deletePostMutation(post.id)}>
                    Delete
                </SafetyButton>
            ) : null}
        </div>
    )
}
