import React, { useState } from 'react'
import { useInput } from './useInput'
import { Form, Message } from 'semantic-ui-react'

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