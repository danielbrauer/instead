import React, { useState } from 'react'
import useInput from './useInput'
import { Form, Message } from 'semantic-ui-react'

export default function FollowUserForm(props) {
    const { value: username, bind: bindUsername, reset: resetUsername } = useInput('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')

    function responseCallback(success, message) {
        setSuccess(success)
        setError(!success)
        setMessage(message)
    }

    function handleSubmit() {
        props.callback(username, responseCallback)
        resetUsername()
    }

    return (
        <div>
            <Form error={error} success={success} onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Input placeholder='Follow' name='username' {...bindUsername} />
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