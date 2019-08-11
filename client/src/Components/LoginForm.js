import React, {useState} from 'react'
import useInput from './useInput'
import { Button, Form, Message, Header, Segment } from 'semantic-ui-react'

export default function LoginForm(props) {
    const { value: username, bind: bindUsername } = useInput('')
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('')
    const [errorStatus, setErrorStatus] = useState(false)
    const [statusMessage, setStatusMessage] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(false)

    const handleSubmit = (evt) => {
        setLoadingStatus(true)
        evt.preventDefault()
        setErrorStatus(false)
        props.onSubmit({ username, password }, submitCallback)
    }

    const submitCallback = (error, response) => {
        setLoadingStatus(false)
        resetPassword()
        if (error) {
            setErrorStatus(true)
            setStatusMessage(error.message)
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
        </div>
    )
}