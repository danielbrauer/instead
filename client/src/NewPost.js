import React, { Component } from 'react'
import { Button, Loader, Segment, Dimmer } from 'semantic-ui-react'

export default class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uploadInput: "",
            uploading: false,
        }
    }
    enableUpload = () => {
        return this.state.uploadInput && this.state.uploadInput.files[0]
    }
    onSubmit = () => {
        this.props.onSubmit(this.state.uploadInput, this.onFinished)
        this.setState({ uploading: true })
    }
    onChange = (event) => {
        this.setState({ uploadInput: event.target })
    }
    onFinished = () => {
        this.props.history.push('/home')
    }
    render() {
        return (
            <Segment>
                <Dimmer inverted active={this.state.uploading} >
                    <Loader inverted />
                </Dimmer>
                <input onChange={this.onChange} type="file" />
                <Button onClick={this.onSubmit} disabled={!this.enableUpload()}>Upload</Button>
            </Segment>
        )
    }
}