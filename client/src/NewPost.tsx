import React, { useCallback, useState } from 'react'
import { Image, Button, Loader, Segment, Dimmer, Menu, Message } from 'semantic-ui-react'
import { History } from 'history'
import { useDropzone } from 'react-dropzone'
import { handleUpload } from './UploadPost'

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
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)

    async function onSubmit() {
        setUploading(true)
        const success = await handleUpload(uploadInput!)
        setUploading(false)
        if (success)
            props.history.push('/home')
        else
            setError(true)
    }

    function onCancel() {
        setUploadInput(null)
    }

    const onDropAccepted = useCallback(acceptedFiles => {
        setUploadInput(acceptedFiles[0])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropAccepted,
        accept: ['image/jpeg', 'image/png'],
    })

    return (
        <div>
            {error ?
                <Message negative>
                    <Message.Header>Sorry, there was an error uploading your post</Message.Header>
                </Message>
                :
                null
            }
            {uploadInput !== null ?
                <div>
                    <Dimmer inverted active={uploading} >
                        <Loader inverted />
                    </Dimmer>
                    <Image fluid src={blobUrl(uploadInput!)} alt={uploadInput.name} />
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
            {uploadInput !== null && !uploading ?
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