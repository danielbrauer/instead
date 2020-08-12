import React from 'react'
import { Menu, Segment, Header, Button, Message, Icon, Label } from "semantic-ui-react"
import { History } from 'history'
import CurrentUser from './CurrentUser'
import WelcomeInfo from './WelcomeInfo'

export interface AppProps {
    history: History,
}

export default function AppWelcome(props : AppProps) {

    function ok() {
        WelcomeInfo.clear()
        props.history.push('/login')
    }

    return (
        <div>
            <Menu inverted fixed='top' size='small'>
                <Menu.Item header>
                    Instead
                </Menu.Item>
            </Menu>
            <br />
            <br />
            <Segment>
                Hi {WelcomeInfo.getDisplayName()}, welcome to Instead!
                <br/>
                <br/>
                Here is your login information:
            </Segment>
            <Segment>
                <Header as='h5'>Username</Header>
                <Label color='black' size='large'><Icon name='paw'/>{WelcomeInfo.getUsername()}</Label>
                <Header as='h5'>Secret Key</Header>
                <Label color='black' size='large'><Icon name='key'/>{CurrentUser.getSecretKey()}</Label>
            <br />
            <br />
            <Message warning>
                <Message.Header>Important</Message.Header>
                <p>You will need these, along with your password, to log in. Please print this page, take a screenshot, or write them down, and store them somewhere safe.</p>

            <Button onClick={ok}>Ok, I've made a copy</Button>
                </Message>

            </Segment>
        </div>
    )
}