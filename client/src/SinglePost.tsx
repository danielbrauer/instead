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

    if (postQuery.isError || !postQuery.data)
        return (
            <div>
                <Message negative>
                    <Message.Header>Error fetching post</Message.Header>
                </Message>
            </div>
        )
    if (postQuery.isLoading)
        return (
            <div>
                <Loader active></Loader>
            </div>
        )
    const post = postQuery.data!

    return (
        <div className='post'>
            <PostHeader post={post} />
            <EncryptedImage post={post} />
            <Comments postId={post.id} limit={0} />
            <NewComment post={post} />
        </div>
    )
}
