import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import { Button, ButtonProps, Form, Header, Message } from 'semantic-ui-react'
import { cancel, loginFull, loginWithEncryptedSecretKey, UserInfo } from '../auth'
import CurrentUser from '../CurrentUser'
import { EncryptedSecretKey } from '../Interfaces'
import InternalLink from './InternalLink'
import './LoginForm.css'
import { useInput } from './useInput'

export default function LoginForm() {
    const history = useHistory()
    const [encryptedSecretKey, setEncryptedSecretKey] = useState<EncryptedSecretKey | undefined>(
        CurrentUser.getEncryptedSecretKey(),
    )
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: secretKey, bind: bindSecretKey } = useInput(CurrentUser.getOldSecretKey() || '')
    const [loginFullMutation, loginFullQuery] = useMutation(loginFull)
    const [loginStoredMutation, loginStoredQuery] = useMutation(loginWithEncryptedSecretKey)
    const loginErrorMessage = loginFullQuery.error ? (loginFullQuery.error as Error).message : ''
    const [cancelMutation] = useMutation(cancel)

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        loginFullQuery.reset()
        try {
            let userInfo: UserInfo | undefined
            if (encryptedSecretKey) {
                userInfo = await loginStoredMutation({ username, password, encryptedSecretKey })
            } else {
                userInfo = await loginFullMutation({ username, password, secretKey })
            }
            CurrentUser.set(userInfo!)
            history.push('/home')
        } catch (error) {
            resetPassword()
            await cancelMutation()
        }
    }

    function clearSecretKey(evt: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) {
        evt.preventDefault()
        CurrentUser.clearSecretKey()
        setEncryptedSecretKey(undefined)
    }

    return (
        <>
            <Form
                className='attached inverted segment'
                size='large'
                error={loginFullQuery.isError}
                loading={
                    loginFullQuery.isLoading ||
                    loginFullQuery.isSuccess ||
                    loginStoredQuery.isLoading ||
                    loginStoredQuery.isSuccess
                }
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
                            <Button icon='delete' onClick={clearSecretKey} />
                        </Button.Group>
                    </div>
                ) : (
                    <Form.Input fluid icon='key' iconPosition='left' placeholder='Secret Key' {...bindSecretKey} />
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
