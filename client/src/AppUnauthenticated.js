import React, { Component } from 'react'
import Axios from 'axios'
import AxiosHelper from './AxiosHelper'
import CurrentUser from './CurrentUser'
import LoginForm from './Components/LoginForm'
import NewUserForm from './Components/NewUserForm'
import { Button, Message, Grid } from 'semantic-ui-react'

class App extends Component {
    // initialize our state
    constructor(props) {
        super(props)
        this.state = {
            newUser: false,
        }
    }

    login = (data, callback) => {
        console.log('logging in')
        Axios.get(this.props.serverUrl + 'login',
            {
                auth: {
                    username: data.username,
                    password: data.password,
                },
            })
            .then(res => {
                CurrentUser.setToken(res.data.token)
                this.props.setLoggedIn(true)
            })
            .catch(error => {
                AxiosHelper.logError(error)
                if (error.response)
                    return callback({message: error.response.data}, null)
                if (error.request)
                    return callback({message: 'No response'}, null)
            })
    }

    createUser = (data, callback) => {
        console.log('creating user')
        Axios.post(this.props.serverUrl + 'new',
            {
                username: data.username,
                password: data.password,
            })
            .then(res => {
                CurrentUser.setToken(res.data.token)
                this.props.setLoggedIn(true)
            })
            .catch(error => {
                AxiosHelper.logError(error)
                if (error.response)
                    return callback({message: error.response.data}, null)
                if (error.request)
                    return callback({message: 'No response'}, null)
            })
    }

    switch = () => {
        this.setState({newUser: !this.state.newUser})
    }

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                {this.state.newUser ?
                    <NewUserForm onSubmit={this.createUser}/>
                    :
                    <LoginForm onSubmit={this.login}/>
                }
                {this.state.newUser ?
                    <Message>
                        Already have an account? <Button onClick={this.switch}>Log In</Button>
                    </Message>
                    :
                    <Message>
                        New to Instead? <Button onClick={this.switch}>Sign Up</Button>
                    </Message>
                }
                </Grid.Column>
            </Grid>
        )
    }
}

export default App