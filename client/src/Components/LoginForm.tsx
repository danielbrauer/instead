import React, {useState} from 'react'
import { useInput } from './useInput'
import { Button, Form, Message, Header, Segment } from 'semantic-ui-react'
import { RouterProps } from 'react-router'
import { MessageCallback, UserPasswordCombo } from '../Interfaces'

interface SubmitCallback {
    (userPassword : UserPasswordCombo, callback : MessageCallback) : void
}

interface LoginFormProps extends RouterProps {
    onSubmit : SubmitCallback
}

export default function LoginForm(props : LoginFormProps) {
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const [errorStatus, setErrorStatus] = useState(false)
    const [statusMessage, setStatusMessage] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(false)

    function handleSubmit(evt : React.FormEvent<HTMLFormElement>) {
        setLoadingStatus(true)
        evt.preventDefault()
        setErrorStatus(false)
        props.onSubmit({ username, password }, submitCallback)
    }

    function submitCallback(message : string) {
        setLoadingStatus(false)
        resetPassword()
        if (message) {
            setErrorStatus(true)
            setStatusMessage(message !== null)
            return
        }
    }

    return (
        <div>
            <Form error={errorStatus} loading={loadingStatus} onSubmit={handleSubmit} size='large'>
                <Segment inverted stacked>
                    <Header as='h2' textAlign='center' content='Instead'/>
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