import React, { useState } from 'react'
import useInput from './useInput'
import { Button, Form, Message, Header, Segment } from 'semantic-ui-react'

export default function NewUserForm(props) {
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: repeatPassword, bind: bindRepeatPassword, reset: resetRepeatPassword } = useInput('')
    const { value: agreeTerms, bind: bindAgreeTerms } = useInput(false)
    const [serverStatus, setServerStatus] = useState('')
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [missedTerms, setMissedTerms] = useState(false)
    const [missedRepeatPassword, setMissedRepeatPassword] = useState(false)

    function handleSubmit(evt) {
        evt.preventDefault()
        const userMissedTerms = !agreeTerms
        setMissedTerms(userMissedTerms)
        const userMissedRepeatPassword = password !== repeatPassword
        if (userMissedRepeatPassword) {
            resetRepeatPassword()
        }
        setMissedRepeatPassword(userMissedRepeatPassword)
        if (userMissedTerms || userMissedRepeatPassword) return
        setLoadingStatus(true)
        setServerStatus('')
        props.onSubmit({ username, password }, submitCallback)
    }

    function submitCallback(error, response) {
        setLoadingStatus(false)
        resetPassword()
        resetRepeatPassword()
        if (error) {
            setServerStatus(error.message)
            return
        }
    }

    return (
        <div>
            <Form error={serverStatus !== ''} loading={loadingStatus} onSubmit={handleSubmit} size='large'>
                <Segment inverted stacked>
                    <Header as='h2' textAlign='center' content='Instead' />
                    <Form.Input
                        fluid
                        icon='user'
                        iconPosition='left'
                        placeholder='Username'
                        {...bindUsername}
                    />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        {...bindPassword}
                    />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Repeat password'
                        type='password'
                        error={missedRepeatPassword ? {
                            content: 'Your password must match',
                        } : false}
                        {...bindRepeatPassword}
                    />
                    <Form.Checkbox
                        label='I agree to the Terms and Conditions'
                        error={(missedTerms && !agreeTerms) ? {
                            content: 'You must agree to the terms and conditions',
                        } : false}
                        {...bindAgreeTerms}
                    />
                    <Message
                        error
                        header='Could not create user'
                        content={serverStatus}
                    />
                    <Button size='large' content='Sign Up' />
                </Segment>
            </Form>
        </div>
    )
}