import React, { Component } from 'react'
import Axios from 'axios'
import AxiosHelper from './AxiosHelper'
import CurrentUser from './CurrentUser'
import LoginForm from './Components/LoginForm'
import NewUserForm from './Components/NewUserForm'
import { Grid } from 'semantic-ui-react'
import { Route, Switch, Redirect } from 'react-router-dom'

const serverUrl = process.env.REACT_APP_BACKEND_URL + 'auth/'

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
                    return callback({ message: error.response.data }, null)
                if (error.request)
                    return callback({ message: 'No response' }, null)
            })
    }

    createUser = (data, callback) => {
        console.log('creating user')
        Axios.post(serverUrl + 'new',
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
                    return callback({ message: error.response.data }, null)
                if (error.request)
                    return callback({ message: 'No response' }, null)
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