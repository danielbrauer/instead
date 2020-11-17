import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import WelcomeInfo from './WelcomeInfo'

export default function AppWelcome() {
    const history = useHistory()

    function ok() {
        WelcomeInfo.clear()
        history.push('/login')
    }

    return (
        <div>
            <Segment>
                Welcome to Instead, {WelcomeInfo.getUsername()}! Here is your Secret Key:
                <br />
                <Header as='h5'>{WelcomeInfo.getSecretKey()}</Header>
                <br />
                <Message warning>
                    <Message.Header>What's a Secret Key?</Message.Header>
                    <p>
                        You will need this if you get a new phone or want to log in from another browser. Please make a copy and put it somewhere safe.
                    </p>

                    <Button onClick={ok}>I've made a copy</Button>
                </Message>
            </Segment>
        </div>
    )
}
