import React from 'react'
import { Placeholder, Image } from 'semantic-ui-react'
import { useEncryptedImage } from './postCrypto'

interface EncryptedImageProps {
    encryptedUrl: string,
    iv: string,
    decKey: string,
    aspect: number,
}

export default function(props: EncryptedImageProps) {
    const decryptedPost = useEncryptedImage(props.decKey, props.iv, props.encryptedUrl)

    if (decryptedPost.isLoading)
        return <Placeholder fluid style={{ height: `${100*props.aspect}vw`}}><Placeholder.Image /></Placeholder>

    return <Image fluid src={decryptedPost.decryptedUrl} alt={'HAM'} />
}