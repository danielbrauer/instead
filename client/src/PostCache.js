import Axios from 'axios'

const base64js = require('base64-js')
const Crypto = window.crypto

class PostCache {
    constructor(getData, setData) {
        this.getData = getData
        this.setData = setData

        this.placeHolderUrl = ""
        this.inProgress = {}
    }

    getDecryptedUrl = (postUrl, iv, key) => {
        if (this.inProgress[postUrl])
            return this.placeHolderUrl
        const decryptedUrl = this.getData(postUrl)
        if (decryptedUrl === undefined) {
            this.inProgress[postUrl] = true
            Crypto.subtle.importKey(
                'jwk',
                JSON.parse(key),
                'AES-GCM',
                false,
                ['encrypt', 'decrypt'],
            ).then(cryptoKey => {
                Axios.get(
                    postUrl,
                    { responseType: 'arraybuffer'}
                ).then(response => {
                    const ivBuffer = base64js.toByteArray(iv)
                    Crypto.subtle.decrypt(
                        {
                            name: 'AES-GCM',
                            iv: ivBuffer,
                        },
                        cryptoKey,
                        response.data,
                    ).then(decrypted => {
                        const blob = new Blob([decrypted], {type:'image/jpeg'})
                        const createdUrl = URL.createObjectURL(blob)
                        delete this.inProgress[postUrl]
                        this.setData(postUrl, createdUrl)
                    })
                })
                return this.placeHolderUrl
            })
        } else {
            return decryptedUrl
        }
    }
}

export default PostCache