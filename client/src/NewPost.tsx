import React, { useCallback, useState } from 'react'
import { Image, Button, Loader, Segment, Dimmer, Menu } from 'semantic-ui-react'
import { History } from 'history'
import { useDropzone } from 'react-dropzone'

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
    onSubmit: (file: File) => void,
}

export default function NewPost(props: NewPostProps) {
    const [uploadInput, setUploadInput] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    async function onSubmit() {
        setUploading(true)
        await props.onSubmit(uploadInput!)
        props.history.push('/home')
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