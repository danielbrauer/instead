import React, { ChangeEvent, useEffect, useReducer, useState } from 'react'
import { useMutation } from 'react-query'
import { Redirect } from 'react-router-dom'
import { Button, Dimmer, Image, Loader, Menu, Message } from 'semantic-ui-react'
import { encryptAndUploadImage } from './postCrypto'

export default function NewPost({
    uploadInput,
    onCancel,
    onSuccess,
}: {
    uploadInput: File
    onCancel: () => void
    onSuccess: () => void
}) {
    const [aspect, setAspect] = useState<number | null>(null)
    const [uploadMutation, uploadStatus] = useMutation(encryptAndUploadImage)
    const [blobUrl, dispatch] = useReducer((state: string, action: File | null) => {
        if (state) URL.revokeObjectURL(state)
        return action ? URL.createObjectURL(action) : ''
    }, '')
    useEffect(() => {
        dispatch(uploadInput)
        return () => dispatch(null)
    }, [uploadInput])

    async function onSubmit() {
        const success = await uploadMutation({ file: uploadInput!, aspect: aspect! })
        if (success) onSuccess()
    }

    function storeImageDimensions(evt: ChangeEvent<HTMLInputElement>) {
        setAspect(evt.target.height / evt.target.width)
    }

    if (!uploadInput || uploadStatus.isSuccess) return <Redirect to='/home' />

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
