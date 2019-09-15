import React, { Component } from 'react'
import { Placeholder, Image } from 'semantic-ui-react'
import Axios from 'axios'

const base64js = require('base64-js')
const Crypto = window.crypto

interface EncryptedImageProps {
    encryptedUrl: string,
    iv: string,
    decKey: JsonWebKey,
}

interface EncryptedImageState {
    imageUrl: string,
    promise: any,
}

const makeCancelable = (promise: any) => {
    let hasCanceled_ = false

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            (val : any) => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
            (error : any) => hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        )
    })

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true
        },
    }
}

export default class EncryptedImage extends Component<EncryptedImageProps, EncryptedImageState> {
    constructor(props: EncryptedImageProps) {
        super(props)
        this.state = {
            imageUrl: '',
            promise: null,
        }
    }

    componentDidMount() {
        const promise = makeCancelable(this.decrypt())
        this.setState({ promise })
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
        } else if (this.state.promise) {
            this.state.promise.cancel()
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