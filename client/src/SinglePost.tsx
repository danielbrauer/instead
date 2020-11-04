import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { Loader, Message } from 'semantic-ui-react'
import Comments from './Comments'
import EncryptedImage from './EncryptedImage'
import NewComment from './NewComment'
import PostHeader from './PostHeader'
import { longLivedQuery } from './QuerySettings'
import { getPost } from './routes/api'

export default function () {
    const { id: postId } = useParams<{ id: string }>()
    const postQuery = useQuery(['post', postId], getPost, longLivedQuery)

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
            </div>
            <EncryptedImage post={post} />
            <div className='post-bottom'>
                <Comments postId={post.id} />
                <NewComment post={post} />
            </div>
        </div>
    )
}
