import React, { useCallback, useState } from 'react'
import { Button, Loader, Segment, Dimmer } from 'semantic-ui-react'
import { History } from 'history'
import { useDropzone } from 'react-dropzone'

let urls = new WeakMap()

let blobUrl = (blob : Blob) => {
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

export default function NewPost(props : NewPostProps) {
    const [uploadInput, setUploadInput] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    function enableUpload() {
        return uploadInput !== null
    }

    async function onSubmit() {
        setUploading(true)
        await props.onSubmit(uploadInput!)
        props.history.push('/home')
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
        <Segment>
            <Dimmer inverted active={uploading} >
                <Loader inverted />
            </Dimmer>
            {enableUpload() ?
                <img src={blobUrl(uploadInput!)}/>
                :
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <Button fluid size='huge' color='blue'>Drop here...</Button>
                            :
                            <Button fluid size='huge'>Drop a photo here</Button>
                    }
                </div>
            }
        </Segment>
        {enableUpload() ?
            <Button onClick={onSubmit} disabled={!enableUpload()}>Upload</Button>
            :
            null
        }
        </div>
    )
}