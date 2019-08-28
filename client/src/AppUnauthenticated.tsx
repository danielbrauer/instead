import React, { Component } from 'react'
import Axios from 'axios'
import AxiosHelper from './AxiosHelper'
import CurrentUser from './CurrentUser'
import LoginForm from './Components/LoginForm'
import NewUserForm from './Components/NewUserForm'
import { Grid } from 'semantic-ui-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import {MessageCallback} from './Interfaces'
import { History } from 'history';

const serverUrl = process.env.REACT_APP_BACKEND_URL + 'auth/'

export interface AppProps {
    history: History,
}

interface User {
    username: string,
    password: string,
}

class App extends Component<AppProps, {}> {
    // initialize our state
    constructor(props : AppProps) {
        super(props)
        this.state = {
            newUser: false,
        }
    }

    login = (data : User, callback : MessageCallback) => {
        console.log('logging in')
        Axios.get(serverUrl + 'login',
            {
                auth: {
                    username: data.username,
                    password: data.password,
                },
            })
            .then(res => {
                CurrentUser.setToken(res.data.token)
                this.props.history.push('/home')
            })
            .catch(error => {
                AxiosHelper.logError(error)
                if (error.response)
                    return callback(error.response.data)
                if (error.request)
                    return callback('No response')
            })
    }

    createUser = (data : User, callback : MessageCallback) => {
        console.log('creating user')
        Axios.post(serverUrl + 'new',
            {
                username: data.username,
                password: data.password,
            })
            .then(res => {
                CurrentUser.setToken(res.data.token)
                this.context.history.push('/home')
            })
            .catch(error => {
                AxiosHelper.logError(error)
                if (error.response)
                    return callback(error.response.data)
                if (error.request)
                    return callback('No response')
            })
    }

    render() {
        if (CurrentUser.loggedIn())
            return (<Redirect to='/home'/>)
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Switch>
                        <Route exact path="/" render={props => <Redirect {...props} to="/login" />} />
                        <Route exact path="/signup" render={props => <NewUserForm {...props} onSubmit={this.createUser} />} />
                        <Route exact path="/login" render={props => <LoginForm {...props} onSubmit={this.login} />} />
                    </Switch>
                </Grid.Column>
            </Grid>
        )
    }
}

export default App