import React, { useState } from 'react'
import { useInput } from './useInput'
import { Form, Message, Segment } from 'semantic-ui-react'

interface FollowUserFormProps {
    callback : (username : string) => Promise<any>,
}

export default function FollowUserForm(props : FollowUserFormProps) {
    const { value: username, bind: bindUsername, reset: resetUsername } = useInput('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit() {
        resetUsername()
        try {
            await props.callback(username)
            responseCallback(true, "Request sent")
        } catch (error) {
            responseCallback(false, error.response.data)
        }
    }
    
    function responseCallback(success : boolean, message : string) {
        setSuccess(success)
        setError(!success)
        setMessage(message)
    }

    return (
        <Segment>
            To follow a user, send a request using their username
            <br/>
            <br/>
            <Form error={error} success={success} onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Input placeholder='Username to follow' name='username' {...bindUsername} />
                    <Form.Button content='Request' disabled={username === ''} />
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

        </Segment>
    )
}