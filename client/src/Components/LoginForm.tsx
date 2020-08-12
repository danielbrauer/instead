import React from 'react'
import { useInput } from './useInput'
import { Button, Form, Message, Header } from 'semantic-ui-react'
import { RouterProps } from 'react-router'
import CurrentUser from '../CurrentUser'
import { login, cancel } from '../auth'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'

export default function LoginForm(props: RouterProps) {
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: secretKey, bind: bindSecretKey } = useInput(CurrentUser.getSecretKey() || '')
    const [loginMutation, { error, reset, isLoading, isSuccess, isError }] = useMutation(login)
    const [cancelMutation] = useMutation(cancel)

    async function handleSubmit(evt : React.FormEvent<HTMLFormElement>) {
        reset()
        evt.preventDefault()
        try {
            const userInfo = await loginMutation({ username, password, secretKey })
            CurrentUser.set(userInfo)
            props.history.push('/home')
        } catch (error) {
            resetPassword()
            await cancelMutation()
        }
    }

    return (
        <div>
            <Form className='attached inverted segment' size='large' error={isError} loading={isLoading || isSuccess} onSubmit={handleSubmit}>
                <Header textAlign='center' content='Instead'/>
                <Form.Input
                    fluid
                    icon='paw'
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
                    autoComplete="current-password"
                    {...bindPassword}
                />
                <Form.Input
                    fluid
                    icon='key'
                    iconPosition='left'
                    placeholder='Secret Key'
                    // autoComplete="current-password"
                    {...bindSecretKey}
                />
                <Message
                    error
                    header='Could not log in'
                    content={error?.message}
                />
                <Button size='large' content='Log in'/>
            </Form>
            <Message attached='bottom' warning>
                New to Instead?&nbsp;<Link to='/signup' onClick={(e) => {e.preventDefault();props.history.push('/signup')}}>Sign up</Link>&nbsp;here.
            </Message>
        </div>
    )
}