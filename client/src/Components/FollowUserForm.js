import React from 'react'
import { Form, Message } from 'semantic-ui-react'
import { LinkedComponent } from 'valuelink'

class FollowUserForm extends LinkedComponent {
    state = { username: '', success: false, error: false, message: '' }

    responseCallback = (success, message) => {
        this.setState({ error: !success, success: success, message: message })
    }

    handleSubmit = () => {
        this.props.callback(this.state.username, this.responseCallback)
        this.setState({ username: '' })
    }

    render() {
        const linked = this.linkAll()
        const { success, error, message } = this.state
        return (
            <div>
                <Form error={error} success={success} onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Form.Input placeholder='Follow' name='username' {...linked.username.props} />
                        <Form.Button content='Request' />
                    </Form.Group>
                    <Message
                        error
                        header={`Can't follow`}
                        content={message}
                    />
                    <Message
                        success
                        header={`Success`}
                        content={message}
                    />
                </Form>

            </div>
        )
    }
}

export default FollowUserForm