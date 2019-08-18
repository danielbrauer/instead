import React, { Component } from 'react'
// import Caman from 'caman'
import { Button, Loader, Segment, Dimmer } from 'semantic-ui-react'

let urls = new WeakMap()

let blobUrl = blob => {
  if (urls.has(blob)) {
    return urls.get(blob)
  } else {
    let url = URL.createObjectURL(blob)
    urls.set(blob, url)
    return url
  }
}

class Dropper extends Component {
    state = { file: null }
  
    onDrag = event => {
      event.preventDefault()
    }
  
    onDrop = event => {
      event.preventDefault()
      let file = event.dataTransfer.files[0]
      this.setState({ file })
      this.props.onSet(file)
    }
  
    render() {
      let { file } = this.state
      let url = file && blobUrl(file)
  
      return (
        <div onDragOver={this.onDrag} onDrop={this.onDrop}>
          <p>Drop an image!</p>
          <img data-caman="brightness(10) contrast(30) sepia(60) saturation(-30)" src={url} />
        </div>
      )
    }
  }

export default class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uploadInput: null,
            uploading: false,
        }
    }
    enableUpload = () => {
        return this.state.uploadInput !== null
    }
    onSubmit = () => {
        this.props.onSubmit(this.state.uploadInput, this.onFinished)
        this.setState({ uploading: true })
    }
    onChange = (file) => {
        this.setState({ uploadInput: file })
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
                <Dropper onSet={this.onChange} />
                <Button onClick={this.onSubmit} disabled={!this.enableUpload()}>Upload</Button>
            </Segment>
        )
    }
}