import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Header, Icon, Label, Menu, Message, Segment } from 'semantic-ui-react'
import CurrentUser from './CurrentUser'
import WelcomeInfo from './WelcomeInfo'

export default function AppWelcome() {
    const history = useHistory()

    function ok() {
        WelcomeInfo.clear()
        history.push('/login')
    }

    return (
        <div>
            <Menu inverted fixed='top' size='small'>
                <Menu.Item header>Instead</Menu.Item>
            </Menu>
            <br />
            <br />
            <Segment>
                Welcome to Instead!
                <br />
                <br />
                Here is your login information:
            </Segment>
            <Segment>
                <Header as='h5'>Username</Header>
                <Label color='black' size='large'>
                    <Icon name='user' />
                    {WelcomeInfo.getUsername()}
                </Label>
                <Header as='h5'>Secret Key</Header>
                <Label color='black' size='large'>
                    <Icon name='key' />
                    {CurrentUser.getEncryptedSecretKey()}
                </Label>
                <br />
                <br />
                <Message warning>
                    <Message.Header>Important</Message.Header>
                    <p>
                        You will need this information to log in on the next page. Please take a screenshot, put it in
                        your password manager, or write it down and store it somewhere safe.
                    </p>

                    <Button onClick={ok}>I've made a copy</Button>
                </Message>
            </Segment>
        </div>
    )
}
