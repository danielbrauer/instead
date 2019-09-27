import React, { Component } from 'react'
import { Placeholder, Image } from 'semantic-ui-react'
import Axios from 'axios'
import { makeCanceler } from './UnmountCleanup'
const base64js = require('base64-js')
const Crypto = window.crypto

interface EncryptedImageProps {
    encryptedUrl: string,
    iv: string,
    decKey: JsonWebKey,
}

interface EncryptedImageState {
    imageUrl: string,
    canceler: any,
}

export default class EncryptedImage extends Component<EncryptedImageProps, EncryptedImageState> {
    constructor(props: EncryptedImageProps) {
        super(props)
        this.state = {
            imageUrl: '',
            canceler: null,
        }
    }

    componentDidMount() {
        const canceler = makeCanceler(this.decrypt())
        this.setState({ canceler })
    }

    async decrypt() {
        const [cryptoKey, encryptedImage] = await Promise.all([
            Crypto.subtle.importKey(
                'jwk',
                this.props.decKey,
                'AES-GCM',
                false,
                ['encrypt', 'decrypt'],
            ),
            Axios.get(
                this.props.encryptedUrl,
                { responseType: 'arraybuffer' }
            )
        ])
        const ivBuffer = base64js.toByteArray(this.props.iv)
        const decrypted = await Crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: ivBuffer,
            },
            cryptoKey,
            encryptedImage.data,
        )
        const blob = new Blob([decrypted], { type: 'image/jpeg' })
        const imageUrl = URL.createObjectURL(blob)
        this.setState({ imageUrl })
    }

    componentWillUnmount() {
        if (this.state.imageUrl) {
            URL.revokeObjectURL(this.state.imageUrl)
        } else if (this.state.canceler) {
            this.state.canceler.cancel()
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.imageUrl
                    ? <Image fluid src={this.state.imageUrl} alt={'HAM'} />
                    : <Placeholder><Placeholder.Image /></Placeholder>
                }
            </div>
        )

    }
}