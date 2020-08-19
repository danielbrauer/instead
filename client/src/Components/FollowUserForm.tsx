import React from 'react'
import { useInput } from './useInput'
import { Form, Message } from 'semantic-ui-react'
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
        <>
            To follow a user, enter their username:
            <br />
            <br />
            <Form
                error={sendFollowRequestQuery.isError}
                success={sendFollowRequestQuery.isSuccess}
                loading={sendFollowRequestQuery.isLoading}
                size='large'
            >
                <Form.Input
                    placeholder='AdjectiveAnimal'
                    name='username'
                    action={{
                        primary: true,
                        content: 'Request',
                        disabled: username === '',
                        onClick: handleSubmit,
                    }}
                    {...bindUsername}
                />
                <Message
                    error
                    header={"Can't follow"}
                    content={sendFollowRequestQuery.isError && (sendFollowRequestQuery.error as Error).message}
                />
                <Message success header={'Success'} content={'Follow request sent'} />
            </Form>
        </>
    )
}
