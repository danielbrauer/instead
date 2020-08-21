import React from 'react'
import { useInput } from './useInput'
import { Form, Message } from 'semantic-ui-react'
import { useMutation } from 'react-query'
import { sendFollowRequest } from '../RoutesAuthenticated'

export default function FollowUserForm() {
    const { value: code, bind: bindCode, reset: resetCode } = useInput('')
    const [sendFollowRequestMutation, sendFollowRequestQuery] = useMutation(sendFollowRequest, { throwOnError: false })

    async function handleSubmit() {
        sendFollowRequestQuery.reset()
        await sendFollowRequestMutation(code)
        resetCode()
    }

    return (
        <>
            To follow a user, enter their Friend Code:
            <br />
            <br />
            <Form
                error={sendFollowRequestQuery.isError}
                success={sendFollowRequestQuery.isSuccess}
                loading={sendFollowRequestQuery.isLoading}
                size='large'
            >
                <Form.Input
                    placeholder='XXX'
                    name='friendCode'
                    action={{
                        primary: true,
                        content: 'Request',
                        disabled: code === '',
                        onClick: handleSubmit,
                    }}
                    {...bindCode}
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
