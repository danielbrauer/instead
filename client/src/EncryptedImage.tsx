import React from 'react'
import { Placeholder, Image } from 'semantic-ui-react'
import { useEncryptedImage } from './postCrypto'
import { Post } from '../../backend/src/types/api'
import { useQuery } from 'react-query'
import { getContentUrl } from './routes/api'
import { longLivedQuery } from './QuerySettings'

export type EncryptedImageProps = {
    post: Post
    size?: number
    className?: string
}

export default function (props: EncryptedImageProps) {
    const contentUrl = useQuery('contentUrl', getContentUrl, longLivedQuery)
    const vw = window.devicePixelRatio*Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const decryptedPost = useEncryptedImage(
        props.post.key,
        props.post.iv,
        props.post.encryptedInfo,
        contentUrl.isSuccess ? contentUrl.data + props.post.filename : '',
        props.size || vw
    )

    if (decryptedPost.isLoading)
        return (
            <Placeholder className={props.className} fluid>
                <Placeholder.Image />
            </Placeholder>
        )

    return <Image className={props.className} fluid src={decryptedPost.results} alt={props.post.filename} />
}
