import React from 'react'
import { Placeholder, Image } from 'semantic-ui-react'
import { useEncryptedImage } from './postCrypto'
import { Post } from '../../backend/src/types/api'
import { useQuery } from 'react-query'
import { getContentUrl } from './routes/api'
import { longLivedQuery } from './QuerySettings'

export default function (props: { post: Post }) {
    const contentUrl = useQuery('contentUrl', getContentUrl, longLivedQuery)
    const decryptedPost = useEncryptedImage(
        props.post.key,
        props.post.iv,
        props.post.encryptedInfo,
        contentUrl.isSuccess ? contentUrl.data + props.post.filename : '',
        77
    )

    if (decryptedPost.isLoading)
        return (
            <Placeholder fluid>
                <Placeholder.Image />
            </Placeholder>
        )

    return <Image fluid src={decryptedPost.results} alt={props.post.filename} />
}
