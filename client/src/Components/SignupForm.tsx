import React, { useState } from 'react'
import { useInput, useInputBool } from './useInput'
import { Button, Form, Message, Header, Segment } from 'semantic-ui-react'
import { RouterProps } from 'react-router'
import CurrentUser from '../CurrentUser'
import { signup, passwordCheck } from '../login'
import { useMutation } from 'react-query'

export default function SignupForm(props: RouterProps) {
    const { value: displayName, bind: bindDisplayName } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: repeatPassword, bind: bindRepeatPassword, reset: resetRepeatPassword } = useInput('')
    const { value: agreeTerms, bind: bindAgreeTerms } = useInputBool(false)
    const [missedTerms, setMissedTerms] = useState(false)
    const [missedRepeatPassword, setMissedRepeatPassword] = useState(false)
    const [passwordCheckMutation, passwordCheckQuery] = useMutation(passwordCheck)
    const [signupMutation, signupQuery] = useMutation(signup)

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        passwordCheckQuery.reset()
        signupQuery.reset()
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
        try {
            await passwordCheckMutation(password)
            const userInfo = await signupMutation({ displayName, password })
            CurrentUser.set(userInfo)
            props.history.push('/welcome')
        } catch (error) {
            resetPassword()
            resetRepeatPassword()
        }
    }

    function getPasswordError(): string | boolean {
        let content = ""
        if (passwordCheckQuery.isError) {
            content = passwordCheckQuery.error.message
        }
        if (missedRepeatPassword) {
            content = 'Your password must match'
        }
        return content || false
    }

    return (
        <div>
            <Form error={signupQuery.isError} loading={passwordCheckQuery.isLoading || signupQuery.isLoading || signupQuery.isSuccess} onSubmit={handleSubmit} size='large'>
                <Segment inverted stacked>
                    <Header as='h2' textAlign='center' content='Instead' />
                    <Form.Input
                        fluid
                        icon='user'
                        iconPosition='left'
                        placeholder='Display Name'
                        autoComplete='off'
                        {...bindDisplayName}
                    />
                    <Form.Input
                        fluid
                        icon='ellipsis horizontal'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        autoComplete='off'
                        {...bindPassword}
                    />
                    <Form.Input
                        fluid
                        icon='ellipsis horizontal'
                        iconPosition='left'
                        placeholder='Repeat password'
                        type='password'
                        autoComplete='off'
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
                        content={signupQuery.error?.message}
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