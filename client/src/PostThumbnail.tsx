import React from 'react'
import { useQuery } from 'react-query'
import { Loader, Message } from 'semantic-ui-react'
import EncryptedImage from './EncryptedImage'
import { longLivedQuery } from './QuerySettings'
import { getPost } from './routes/api'

export default function (props: { postId: number }) {
    const postQuery = useQuery(['post', props.postId], getPost, longLivedQuery)
    const className = { className: 'post-thumbnail'}

    if (postQuery.isLoading)
        return <Loader {...className} active></Loader>
    if (postQuery.isError || !postQuery.data)
        return <Message {...className} negative />
    const post = postQuery.data!

    return <EncryptedImage {...className} post={post} size={128}/>
}
