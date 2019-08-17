import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

export default class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uploadInput: "",
        }
    }
    enableUpload = () => {
        return this.state.uploadInput && this.state.uploadInput.files[0]
    }
    onSubmit = () => {
        this.props.onSubmit(this.state.uploadInput)
    }
    onChange = (event) => {
        this.setState({ uploadInput: event.target })
    }
    render() {
        return (
            <div style={{ padding: '10px' }}>
                <input onChange={this.onChange} type="file" />
                <Button onClick={this.onSubmit} disabled={!this.enableUpload()}>Upload</Button>
            </div>
        )
    }
}