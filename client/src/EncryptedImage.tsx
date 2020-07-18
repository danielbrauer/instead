import React from 'react'
import { Placeholder, Image } from 'semantic-ui-react'
import { useEncryptedImage } from './postCrypto'

interface EncryptedImageProps {
    encryptedUrl: string,
    iv: string,
    decKey: string,
}

export default function(props: EncryptedImageProps) {
    const decryptedPost = useEncryptedImage(props.decKey, props.iv, props.encryptedUrl)

    if (decryptedPost.isLoading)
        return <Placeholder><Placeholder.Image /></Placeholder>

    return <Image fluid src={decryptedPost.decryptedUrl} alt={'HAM'} />
}