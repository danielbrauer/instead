import React from 'react'
import { Menu, Segment, Header, Button } from "semantic-ui-react"
import { History } from 'history'
import CurrentUser from './CurrentUser'

export interface AppProps {
    history: History,
}

export default function AppWelcome(props : AppProps) {

    function ok() {
        props.history.push('/home')
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
                <Header>Username</Header>
                {CurrentUser.getUsername()}
                <Header>Secret Key</Header>
                {CurrentUser.getSecretKey()}
            <br />
            You will need these, along with your password, to log in. Please print this page, take a screenshot, or write them down, and store them somewhere safe.

            </Segment>
            <Button onClick={ok}>Got it</Button>
        </div>
    )
}