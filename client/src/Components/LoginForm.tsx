import React, {useState} from 'react'
import { useInput } from './useInput'
import { Button, Form, Message, Header, Segment } from 'semantic-ui-react'
import { RouterProps } from 'react-router'
import CurrentUser from '../CurrentUser'
import { login } from '../login'

export default function LoginForm(props: RouterProps) {
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const { value: secretKey, bind: bindSecretKey } = useInput(CurrentUser.getSecretKey() || '')
    const [errorStatus, setErrorStatus] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [loadingStatus, setLoadingStatus] = useState(false)

    async function handleSubmit(evt : React.FormEvent<HTMLFormElement>) {
        setLoadingStatus(true)
        evt.preventDefault()
        setErrorStatus(false)
        try {
            const { userid, displayName } = await login({ username, password, secretKey })
            CurrentUser.set(userid, username, secretKey, displayName)
            props.history.push('/home')
        } catch (error) {
            let message = 'Please try again'
            if (error.response)
                message = error.response.data
            setLoadingStatus(false)
            resetPassword()
            setErrorStatus(true)
            setStatusMessage(message)
        }
    }

    return (
        <div>
            <Form error={errorStatus} loading={loadingStatus} onSubmit={handleSubmit} size='large'>
                <Segment inverted stacked>
                    <Header as='h2' textAlign='center' content='Instead'/>
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
                      content={statusMessage}
                    />
                    <Button size='large' content='Log in'/>
                </Segment>
            </Form>
            <Message>
                New to Instead? <Button onClick={() => props.history.push('/signup')}>Sign Up</Button>
            </Message>
        </div>
    )
}