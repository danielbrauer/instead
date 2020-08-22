import React from 'react'
import { useParams } from 'react-router-dom'
import PostHeader from './PostHeader'
import EncryptedImage from './EncryptedImage'
import { useQuery } from 'react-query'
import { Message, Loader } from 'semantic-ui-react'
import { getPost } from './routes/api'
import Comments from './Comments'
import NewComment from './NewComment'
import { longLivedQuery } from './QuerySettings'

export default function () {
    const { id: postId } = useParams()
    const postQuery = useQuery(['post', postId], getPost, longLivedQuery)

    if (postQuery.isError)
        return (
            <div>
                <Message negative>
                    <Message.Header>Error fetching posts</Message.Header>
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
        <div>
            <PostHeader post={post} />
            <EncryptedImage post={post} />
            <Comments postId={post.id} />
            <NewComment post={post} />
        </div>
    )
}
