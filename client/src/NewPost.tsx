import React, { ChangeEvent, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { Redirect } from 'react-router-dom'
import { Button, Dimmer, Image, Loader, Menu, Message, Segment } from 'semantic-ui-react'
import { encryptAndUploadImage } from './postCrypto'

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

    const inputFile = useRef<HTMLInputElement>(null)

    async function onSubmit() {
        await uploadMutation({ file: uploadInput!, aspect: aspect! })
    }

    function onClick() {
        inputFile.current!.click()
    }

    function onCancel() {
        setUploadInput(null)
    }

    function storeImageDimensions(evt: ChangeEvent<HTMLInputElement>) {
        setAspect(evt.target.height / evt.target.width)
    }

    if (uploadStatus.isSuccess) return <Redirect to='/home' />

    return (
        <>
            <input
                type='file'
                id='file'
                accept='image/jpeg, image/png'
                ref={inputFile}
                onChange={(evt) => setUploadInput(evt.target.files && evt.target.files[0])}
                style={{ display: 'none' }}
            />
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
                    <Button fluid size='huge' onClick={onClick} content='Drop a photo here' />
                    {/* <input type='file' className='button' onChange={chooseImage} /> */}
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
