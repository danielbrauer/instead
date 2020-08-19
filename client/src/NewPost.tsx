import React, { useCallback, useState } from 'react'
import { Image, Button, Loader, Segment, Dimmer, Menu, Message } from 'semantic-ui-react'
import { useDropzone } from 'react-dropzone'
import { encryptAndUploadImage } from './postCrypto'
import { useMutation } from 'react-query'
import { Redirect } from 'react-router-dom'

const urls = new WeakMap()

const blobUrl = (blob: Blob) => {
    if (urls.has(blob)) {
        return urls.get(blob)
    } else {
        const url = URL.createObjectURL(blob)
        urls.set(blob, url)
        return url
    }
}

export default function NewPost() {
    const [uploadInput, setUploadInput] = useState<File | null>(null)
    const [aspect, setAspect] = useState<number | null>(null)
    const [uploadMutation, uploadStatus] = useMutation(encryptAndUploadImage)
    const onDropAccepted = useCallback((acceptedFiles) => {
        setUploadInput(acceptedFiles[0])
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropAccepted,
        accept: ['image/jpeg', 'image/png'],
    })

    async function onSubmit() {
        await uploadMutation({ file: uploadInput!, aspect: aspect! })
    }

    function onCancel() {
        setUploadInput(null)
    }

    function storeImageDimensions({ target }: any) {
        setAspect(target.height / target.width)
    }

    if (uploadStatus.isSuccess) return <Redirect to='/home' />

    return (
        <>
            {uploadStatus.error ? (
                <Message negative>
                    <Message.Header>Sorry, there was an error uploading your post</Message.Header>
                </Message>
            ) : null}
            {uploadInput !== null ? (
                <>
                    <Dimmer inverted active={uploadStatus.isLoading || uploadStatus.isSuccess}>
                        <Loader inverted />
                    </Dimmer>
                    <Image fluid onLoad={storeImageDimensions} src={blobUrl(uploadInput!)} alt={uploadInput.name} />
                </>
            ) : (
                <Segment vertical>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <Button fluid size='huge' color='blue' content='Drop here...' />
                        ) : (
                            <Button fluid size='huge' content='Drop a photo here' />
                        )}
                    </div>
                </Segment>
            )}
            {uploadInput !== null && !uploadStatus.isLoading ? (
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
