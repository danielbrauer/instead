import React from 'react'
import { useInput } from './useInput'
import { Form, Message, Segment } from 'semantic-ui-react'
import { useMutation } from 'react-query'
import { sendFollowRequest } from '../RoutesAuthenticated'

export default function FollowUserForm() {
    const { value: username, bind: bindUsername, reset: resetUsername } = useInput('')
    const [sendFollowRequestMutation, sendFollowRequestQuery] = useMutation(sendFollowRequest)

    async function handleSubmit() {
        sendFollowRequestQuery.reset()
        await sendFollowRequestMutation(username)
        resetUsername()
    }

    return (
        <Segment>
            To follow a user, enter their username:
            <br />
            <br />
            <Form
                error={sendFollowRequestQuery.isError}
                success={sendFollowRequestQuery.isSuccess}
                onSubmit={handleSubmit}
                size='large'
            >
                <Form.Group>
                    <Form.Input placeholder='AdjectiveAnimal' name='username' {...bindUsername} />
                    <Form.Button size='large' content='Request' disabled={username === ''} />
                </Form.Group>
                <Message
                    error
                    header={"Can't follow"}
                    content={sendFollowRequestQuery.isError && (sendFollowRequestQuery.error as Error).message}
                />
                <Message success header={'Success'} content={'Follow request sent'} />
            </Form>
        </Segment>
    )
}
