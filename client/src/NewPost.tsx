import React, { useEffect, useReducer } from 'react'
import { useMutation } from 'react-query'
import { Redirect } from 'react-router-dom'
import { Dimmer, Form, Image, Loader, Message } from 'semantic-ui-react'
import { useInput } from './Components/useInput'
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
    const commentInput = useInput('')
    const [uploadMutation, uploadStatus] = useMutation(encryptAndUploadImage, {throwOnError: true})
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
        try {
            await uploadMutation({ file: uploadInput!, comment: commentInput.value })
            onSuccess()
        } catch (error) {
            console.log(error.message)
        }
    }

    if (!uploadInput || uploadStatus.isSuccess) return <Redirect to='/home' />

    return (
        <>
            {uploadStatus.error ? (
                <Message negative>
                    <Message.Header>Sorry, there was an error uploading your post: {(uploadStatus.error as Error).message}</Message.Header>
                </Message>
            ) : null}
            <>
                <Dimmer inverted active={uploadStatus.isLoading || uploadStatus.isSuccess}>
                    <Loader inverted />
                </Dimmer>
                <Image fluid src={blobUrl} alt={uploadInput.name} />
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
