import React from 'react'
import { Placeholder, Image } from 'semantic-ui-react'
import { useEncryptedImage } from './postCrypto'
import { Post } from '../../backend/src/types/api'
import { useQuery } from 'react-query'
import { getContentUrl } from './RoutesAuthenticated'

export default function(props: { post: Post }) {
    const contentUrl = useQuery('contentUrl', getContentUrl)
    const decryptedPost = useEncryptedImage(props.post.key, props.post.iv, contentUrl.isSuccess ? contentUrl.data + props.post.filename : '')

    if (decryptedPost.isLoading)
        return <Placeholder fluid style={{ height: `${100*props.post.aspect}vw`}}><Placeholder.Image /></Placeholder>

    return <Image fluid src={decryptedPost.results} alt={props.post.filename} />
}