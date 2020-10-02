import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import { Button, Form, Header, Label, Message } from 'semantic-ui-react'
import { cancel, loginFull, loginWithEncryptedSecretKey, UserInfo } from '../auth'
import CurrentUser from '../CurrentUser'
import { EncryptedSecretKey } from '../Interfaces'
import InternalLink from './InternalLink'
import { useInput } from './useInput'

export default function LoginForm() {
    const history = useHistory()
    const [encryptedSecretKey] = useState<EncryptedSecretKey>(CurrentUser.getEncryptedSecretKey())
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: secretKey, bind: bindSecretKey } = useInput(CurrentUser.getOldSecretKey() || '')
    const [loginFullMutation, loginFullQuery] = useMutation(loginFull)
    const [loginStoredMutation, loginStoredQuery] = useMutation(loginWithEncryptedSecretKey)
    const loginErrorMessage = loginFullQuery.error ? (loginFullQuery.error as Error).message : ''
    const [cancelMutation] = useMutation(cancel)

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        loginFullQuery.reset()
        evt.preventDefault()
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

    return (
        <div>
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
                    <Label>{encryptedSecretKey.prefix}</Label>
                ) : (
                    <Form.Input fluid icon='key' iconPosition='left' placeholder='Secret Key' {...bindSecretKey} />
                )}
                <Message error header='Could not log in' content={loginErrorMessage} />
                <Button size='large' content='Log in' />
            </Form>
            <Message attached='bottom' warning>
                New to Instead?&nbsp;<InternalLink to='/signup'>Sign up</InternalLink>&nbsp;here.
            </Message>
        </div>
    )
}
