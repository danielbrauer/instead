import React, { ChangeEvent, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { Redirect } from 'react-router-dom'
import { Button, Dimmer, Image, Loader, Menu, Message } from 'semantic-ui-react'
import { encryptAndUploadImage } from './postCrypto'

export default function NewPost({ uploadInput, onCancel }: { uploadInput: File; onCancel: () => void }) {
    const [aspect, setAspect] = useState<number | null>(null)
    const [uploadMutation, uploadStatus] = useMutation(encryptAndUploadImage)
    const [blobUrl, setBlobUrl] = useState('')
    useEffect(() => {
        setBlobUrl(URL.createObjectURL(uploadInput))
        return () => {
            URL.revokeObjectURL(blobUrl)
        }
    }, [])

    if (!uploadInput) {
        onCancel()
    }

    async function onSubmit() {
        await uploadMutation({ file: uploadInput!, aspect: aspect! })
    }

    function storeImageDimensions(evt: ChangeEvent<HTMLInputElement>) {
        setAspect(evt.target.height / evt.target.width)
    }

    if (uploadStatus.isSuccess) return <Redirect to='/home' />

    return (
        <>
            {uploadStatus.error ? (
                <Message negative>
                    <Message.Header>Sorry, there was an error uploading your post</Message.Header>
                </Message>
            ) : null}
            <>
                <Dimmer inverted active={uploadStatus.isLoading || uploadStatus.isSuccess}>
                    <Loader inverted />
                </Dimmer>
                <Image fluid onLoad={storeImageDimensions} src={blobUrl} alt={uploadInput.name} />
            </>
            {!uploadStatus.isLoading ? (
                <Menu secondary fluid fixed='bottom'>
                    <Menu.Item>
                        <Button negative onClick={onCancel} content='Cancel' />
                    </Menu.Item>

                    <Menu.Item position='right'>
                        <Button positive onClick={onSubmit} content='Upload' />
                    </Menu.Item>
                </Menu>
            ) : null}
        </>
    )
}
