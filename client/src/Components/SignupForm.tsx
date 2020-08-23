import React, { useState } from 'react'
import { useInput, useInputBool } from './useInput'
import { Button, Form, Message, Header } from 'semantic-ui-react'
import CurrentUser from '../CurrentUser'
import { signup, passwordCheck } from '../auth'
import { useMutation } from 'react-query'
import WelcomeInfo from '../WelcomeInfo'
import InternalLink from './InternalLink'
import { useHistory } from 'react-router-dom'

export default function SignupForm() {
    const history = useHistory()
    const { value: username, bind: bindUsername } = useInput('', (x) => x.replace(/[^0-9a-zA-Z]/g, ''))
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: agreeTerms, bind: bindAgreeTerms } = useInputBool(false)
    const [missedTerms, setMissedTerms] = useState(false)
    const [passwordCheckMutation, passwordCheckQuery] = useMutation(passwordCheck)
    const [signupMutation, signupQuery] = useMutation(signup)

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        passwordCheckQuery.reset()
        signupQuery.reset()
        const userMissedTerms = !agreeTerms
        setMissedTerms(userMissedTerms)
        if (userMissedTerms) return
        try {
            await passwordCheckMutation(password)
            const userInfo = await signupMutation({ username, password })
            CurrentUser.setSecretKey(userInfo!.secretKey)
            WelcomeInfo.set({ username })
            history.push('/welcome')
        } catch (error) {
            resetPassword()
        }
    }

    return (
        <div>
            <Form
                className='attached inverted segment'
                size='large'
                error={signupQuery.isError}
                loading={passwordCheckQuery.isLoading || signupQuery.isLoading || signupQuery.isSuccess}
                onSubmit={handleSubmit}
            >
                <Header textAlign='center' content='Instead' />
                <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='Username'
                    type='username'
                    autoComplete='off'
                    {...bindUsername}
                />
                <Form.Input
                    fluid
                    icon='ellipsis horizontal'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    autoComplete='off'
                    error={passwordCheckQuery.isError && (passwordCheckQuery.error as Error).message}
                    {...bindPassword}
                />
                <Form.Checkbox
                    label='I agree to the Terms and Conditions'
                    error={
                        missedTerms && !agreeTerms
                            ? {
                                  content: 'You must agree to the terms and conditions',
                              }
                            : false
                    }
                    {...bindAgreeTerms}
                />
                <Message
                    error
                    header='Could not create user'
                    content={signupQuery.isError && (signupQuery.error as Error).message}
                />
                <Button size='large' content='Sign Up' />
            </Form>
            <Message attached='bottom' warning>
                Already have an account?&nbsp;<InternalLink to='/login'>Log in</InternalLink>&nbsp;here.
            </Message>
        </div>
    )
}
