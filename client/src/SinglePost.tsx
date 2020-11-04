import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { Loader, Message } from 'semantic-ui-react'
import Comments from './Comments'
import CurrentUser from './CurrentUser'
import EncryptedImage from './EncryptedImage'
import NewComment from './NewComment'
import PostHeader from './PostHeader'
import { longLivedQuery } from './QuerySettings'
import { deletePost, getPost } from './routes/api'
import SafetyButton from './SafetyButton'

export default function () {
    const { id: postId } = useParams<{ id: string }>()
    const postQuery = useQuery(['post', postId], getPost, longLivedQuery)
    const [deletePostMutation] = useMutation(deletePost)

    if (postQuery.isLoading)
        return (
            <div>
                <Loader active></Loader>
            </div>
        )
    if (postQuery.isError || !postQuery.data)
        return (
            <div>
                <Message negative>
                    <Message.Header>Error fetching post</Message.Header>
                </Message>
            </div>
        )
    const post = postQuery.data!

    return (
        <div className='post'>
            <div className='post-top'>
                <PostHeader post={post} />
                {CurrentUser.getId() === post.authorId ? (
                    <SafetyButton floated='right' size='mini' onClick={() => deletePostMutation(post.id)}>
                        Delete
                    </SafetyButton>
                ) : null}
            </div>
            <EncryptedImage post={post} />
            <div className='post-bottom'>
                <Comments postId={post.id} />
                <NewComment post={post} />
            </div>
        </div>
    )
}
