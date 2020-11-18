import React, { ChangeEvent, useEffect, useReducer, useState } from 'react'
import { useMutation } from 'react-query'
import { Redirect } from 'react-router-dom'
import { Dimmer, Form, Image, Loader, Message } from 'semantic-ui-react'
import { useInput } from './Components/useInput'
import { ImageInfo, encryptAndUploadImage } from './postCrypto'

export default function NewPost({
    uploadInput,
    onCancel,
    onSuccess,
}: {
    uploadInput: File
    onCancel: () => void
    onSuccess: () => void
}) {
    const commentInput = useInput('')
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
    const [uploadMutation, uploadStatus] = useMutation(encryptAndUploadImage)
    const [blobUrl, dispatch] = useReducer((state: string, action: File | null) => {
        if (state) URL.revokeObjectURL(state)
        return action ? URL.createObjectURL(action) : ''
    }, '')
    useEffect(() => {
        dispatch(uploadInput)
        return () => dispatch(null)
    }, [uploadInput])

    async function onSubmit(event: React.MouseEvent) {
        event.preventDefault()
        const success = await uploadMutation({ file: uploadInput!, info: imageInfo!, comment: commentInput.value })
        if (success) onSuccess()
    }

    function storeImageDimensions(evt: ChangeEvent<HTMLInputElement>) {
        setImageInfo({height: evt.target.height, width: evt.target.width})
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
                <div className='new-post-form'>
                    <Form>
                        <Form.Input size='large' placeholder='Comment' {...commentInput.bind} />
                        <Form.Group>
                            <Form.Button type='button' negative onClick={onCancel} content='Cancel' />
                            <Form.Button type='submit' positive onClick={onSubmit} content='Upload' />
                        </Form.Group>
                    </Form>
                </div>
            ) : null}
        </>
    )
}
