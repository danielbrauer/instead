import React from 'react'
import { useMutation } from 'react-query'
import { Form, Message } from 'semantic-ui-react'
import { sendFollowRequest } from '../routes/api'
import './FollowUserForm.css'
import { useInput } from './useInput'

export default function FollowUserForm() {
    const { value: code, bind: bindCode, reset: resetCode } = useInput('', (x) =>
        x.toUpperCase().replace(/[^2-9A-HJ-NP-Z]/g, ''),
    )
    const [sendFollowRequestMutation, sendFollowRequestQuery] = useMutation(sendFollowRequest, { throwOnError: false })

    async function handleSubmit() {
        sendFollowRequestQuery.reset()
        await sendFollowRequestMutation(code)
        resetCode()
    }

    return (
        <div className='follow-user-form-container'>
            To follow a user, enter their Friend Code:
            <br />
            <br />
            <Form
                error={sendFollowRequestQuery.isError}
                success={sendFollowRequestQuery.isSuccess}
                loading={sendFollowRequestQuery.isLoading}
                size='large'
            >
                <Form.Group>
                    <Form.Input className='follow-user-form-form' placeholder='XXX' name='friendCode' {...bindCode} />
                    <Form.Button
                        primary
                        content='Request'
                        disabled={code.length < 3}
                        onClick={handleSubmit}
                        size='large'
                    />
                </Form.Group>
                <Message
                    error
                    header={"Can't follow"}
                    content={sendFollowRequestQuery.isError && (sendFollowRequestQuery.error as Error).message}
                />
                <Message success header={'Success'} content={'Follow request sent'} />
            </Form>
        </div>
    )
}
