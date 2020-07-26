import React, { useCallback, useState } from 'react'
import { Image, Button, Loader, Segment, Dimmer, Menu, Message } from 'semantic-ui-react'
import { History } from 'history'
import { useDropzone } from 'react-dropzone'
import { handleUpload } from './postCrypto'
import { useMutation } from 'react-query'
import { Redirect } from 'react-router-dom'

let urls = new WeakMap()

let blobUrl = (blob: Blob) => {
    if (urls.has(blob)) {
        return urls.get(blob)
    } else {
        let url = URL.createObjectURL(blob)
        urls.set(blob, url)
        return url
    }
}

interface NewPostProps {
    history: History,
}

export default function NewPost(props: NewPostProps) {
    const [uploadInput, setUploadInput] = useState<File | null>(null)
    const [aspect, setAspect] = useState<number | null>(null)
    const [uploadMutation, uploadStatus] = useMutation(handleUpload)
    const onDropAccepted = useCallback(acceptedFiles => {
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

    function storeImageDimensions({target}: any) {
        setAspect(target.height/target.width)
    }

    if (uploadStatus.isSuccess)
        return (<Redirect to='/home' />)

    return (
        <div>
            {uploadStatus.error ?
                <Message negative>
                    <Message.Header>Sorry, there was an error uploading your post</Message.Header>
                </Message>
                :
                null
            }
            {uploadInput !== null ?
                <div>
                    <Dimmer inverted active={uploadStatus.isLoading || uploadStatus.isSuccess} >
                        <Loader inverted />
                    </Dimmer>
                    <Image fluid onLoad={storeImageDimensions} src={blobUrl(uploadInput!)} alt={uploadInput.name} />
                </div>
                :
                <Segment>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <Button fluid size='huge' color='blue'>Drop here...</Button>
                                :
                                <Button fluid size='huge'>Drop a photo here</Button>
                        }
                    </div>
                </Segment>
            }
            {uploadInput !== null && !uploadStatus.isLoading ?
                <Menu secondary fluid fixed='bottom'>
                    <Menu.Item>
                        <Button negative onClick={onCancel}>Cancel</Button>
                    </Menu.Item>

                    <Menu.Item position='right'>
                        <Button positive onClick={onSubmit}>Upload</Button>
                    </Menu.Item>
                </Menu>
                :
                null
            }
        </div>
    )
}