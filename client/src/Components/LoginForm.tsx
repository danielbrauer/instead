import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import { Button, ButtonProps, Form, Header, Message } from 'semantic-ui-react'
import { cancel, loginWithPlainOrEncryptedSecretKey } from '../auth'
import CurrentUser from '../CurrentUser'
import InternalLink from './InternalLink'
import './LoginForm.css'
import { useInput, useInputBool } from './useInput'

export default function LoginForm() {
    const history = useHistory()
    const [encryptedSecretKey, setEncryptedSecretKey] = useState(() => CurrentUser.getEncryptedSecretKey())
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: secretKey, bind: bindSecretKey } = useInput(CurrentUser.getOldSecretKey() || '')
    const { value: sharedComputer, bind: bindSharedComputer } = useInputBool(false)
    const [loginMutation, loginQuery] = useMutation(loginWithPlainOrEncryptedSecretKey)
    const loginErrorMessage = loginQuery.error ? (loginQuery.error as Error).message : ''
    const [cancelMutation] = useMutation(cancel)

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        loginQuery.reset()
        try {
            const userInfo = await loginMutation({ username, password, secretKey, encryptedSecretKey })
            CurrentUser.set(userInfo!, !sharedComputer)
            history.push('/home')
        } catch (error) {
            resetPassword()
            await cancelMutation()
        }
    }

    function clearSecretKey(evt: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) {
        console.trace()
        evt.preventDefault()
        CurrentUser.clearSecretKey()
        setEncryptedSecretKey(null)
    }

    return (
        <>
            <Form
                className='attached inverted segment'
                size='large'
                error={loginQuery.isError}
                loading={loginQuery.isLoading || loginQuery.isSuccess}
                onSubmit={handleSubmit}
            >
                <Header textAlign='center' content='Instead' />
                <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='Username'
                    autoComplete='username'
                    {...bindUsername}
                />
                <Form.Input
                    fluid
                    icon='ellipsis horizontal'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    autoComplete='current-password'
                    {...bindPassword}
                />
                {encryptedSecretKey ? (
                    <div className='saved-secret-key-container'>
                        <Button.Group fluid size='large'>
                            <Button
                                className='saved-secret-key-field'
                                icon='key'
                                disabled
                                content={`${encryptedSecretKey.prefix}•••••••••••••••`}
                            />
                            <Button className='saved-secret-key-clear-button' icon='delete' onClick={clearSecretKey} />
                        </Button.Group>
                    </div>
                ) : (
                    <>
                        <Form.Input fluid icon='key' iconPosition='left' placeholder='Secret Key' {...bindSecretKey} />
                        <Form.Checkbox label='This is a public or shared computer' {...bindSharedComputer} />
                    </>
                )}
                <Message error header='Could not log in' content={loginErrorMessage} />
                <Button size='large' content='Log in' />
            </Form>
            <Message attached='bottom' warning>
                New to Instead?&nbsp;<InternalLink to='/signup'>Sign up</InternalLink>&nbsp;here.
            </Message>
        </>
    )
}
