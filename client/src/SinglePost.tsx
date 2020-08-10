import React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import PostHeader from './PostHeader'
import EncryptedImage from './EncryptedImage'
import { useQuery } from 'react-query'
import { Message, Loader } from 'semantic-ui-react'
import { getPost } from './RoutesAuthenticated'
import Comments from './Comments'
import NewComment from './NewComment'

export default function(props: RouteComponentProps<any>) {
    const { id: postId } = useParams()
    const postQuery = useQuery(['post', postId], getPost)

    if (postQuery.isError) return (
        <div>
            <Message negative>
                <Message.Header>Error fetching posts</Message.Header>
            </Message>
        </div>
    )
    if (postQuery.isLoading) return (
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