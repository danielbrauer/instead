import React, { Component } from 'react'
import { Placeholder, Image } from 'semantic-ui-react'
import Axios from 'axios'

const base64js = require('base64-js')
const Crypto = window.crypto

interface EncryptedImageProps {
    url: string,
    iv: string,
    decKey: string,
}

interface EncryptedImageState {
    url: string,
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
            url: '',
            promise: null,
        }
    }

    componentDidMount() {
        const promise = makeCancelable(
            Crypto.subtle.importKey(
                'jwk',
                JSON.parse(this.props.decKey),
                'AES-GCM',
                false,
                ['encrypt', 'decrypt'],
            ).then(cryptoKey => {
                Axios.get(
                    this.props.url,
                    { responseType: 'arraybuffer' }
                ).then(response => {
                    const ivBuffer = base64js.toByteArray(this.props.iv)
                    Crypto.subtle.decrypt(
                        {
                            name: 'AES-GCM',
                            iv: ivBuffer,
                        },
                        cryptoKey,
                        response.data,
                    ).then(decrypted => {
                        const blob = new Blob([decrypted], { type: 'image/jpeg' })
                        const createdUrl = URL.createObjectURL(blob)
                        this.setState({ url: createdUrl })
                    })
                })
            })
        )
        this.setState({ promise: promise })
    }

    componentWillUnmount() {
        if (this.state.url) {
            URL.revokeObjectURL(this.state.url)
        } else if (this.state.promise) {
            this.state.promise.cancel()
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.url
                    ? <Image fluid src={this.state.url} alt={'HAM'} />
                    : <Placeholder><Placeholder.Image /></Placeholder>
                }
            </div>
        )

    }
}