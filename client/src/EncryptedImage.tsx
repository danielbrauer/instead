import React from 'react'
import { useQuery } from 'react-query'
import { Image, Placeholder } from 'semantic-ui-react'
import { Post } from '../../backend/src/types/api'
import { useEncryptedImage } from './postCrypto'
import { longLivedQuery } from './QuerySettings'
import { getContentUrl } from './routes/api'

export type EncryptedImageProps = {
    post: Post
    size?: number
    className?: string
}

export default function (props: EncryptedImageProps) {
    const contentUrl = useQuery('contentUrl', getContentUrl, longLivedQuery)
    const vw = window.devicePixelRatio*Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const decryptedPost = useEncryptedImage(
        props.post,
        contentUrl.isSuccess ? contentUrl.data! : '',
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
