import React, { useState } from 'react'
import { useInput, useInputBool } from './useInput'
import { Button, Form, Message, Header, Segment } from 'semantic-ui-react'
import { UserPasswordCombo } from '../Interfaces'
import { RouterProps } from 'react-router'
import { pwnedPassword } from 'hibp'

interface NewUserFormProps extends RouterProps {
    onSubmit : (userPassword : UserPasswordCombo) => void
}

export default function NewUserForm(props : NewUserFormProps) {
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: repeatPassword, bind: bindRepeatPassword, reset: resetRepeatPassword } = useInput('')
    const { value: agreeTerms, bind: bindAgreeTerms } = useInputBool(false)
    const [serverStatus, setServerStatus] = useState('')
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [missedTerms, setMissedTerms] = useState(false)
    const [missedRepeatPassword, setMissedRepeatPassword] = useState(false)
    const [passwordBreached, setPasswordBreached] = useState(0)

    async function handleSubmit(evt : React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        const userMissedTerms = !agreeTerms
        setMissedTerms(userMissedTerms)
        const userMissedRepeatPassword = password !== repeatPassword
        if (userMissedRepeatPassword) {
            resetPassword()
            resetRepeatPassword()
        }
        setMissedRepeatPassword(userMissedRepeatPassword)
        if (userMissedTerms || userMissedRepeatPassword)
            return
        setLoadingStatus(true)
        try {
            const passwordBreachCount = await pwnedPassword(password)
            setPasswordBreached(passwordBreachCount)
            if (passwordBreachCount > 0)
                return
            setServerStatus('')
            await props.onSubmit({ username, password })
        } catch (error) {
            let message = 'Please try again'
            if (error.response)
                message = error.response.data
            if (message)
                setServerStatus(message)
        } finally {
            setLoadingStatus(false)
            resetPassword()
            resetRepeatPassword()
        }
    }

    function getPasswordError() : string | boolean {
        let content = ""
        if (passwordBreached) {
            content = 'This password is well-known, and you can\'t use it here. If it is your password, you should change it.'
        }
        if (missedRepeatPassword) {
            content = 'Your password must match'
        }
        return content || false
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
                        error={getPasswordError()}
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
            <Message>
                Already have an account? <Button onClick={() => props.history.push('/login')}>Log In</Button>
            </Message>
        </div>
    )
}