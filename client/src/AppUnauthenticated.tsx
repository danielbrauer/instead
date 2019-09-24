import React, { Component } from 'react'
import Axios, { AxiosInstance } from 'axios'
import CurrentUser from './CurrentUser'
import LoginForm from './Components/LoginForm'
import NewUserForm from './Components/NewUserForm'
import { Grid } from 'semantic-ui-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { History } from 'history'
import config from './config'

const serverUrl = `${config.serverUrl}/auth`

export interface AppProps {
    history: History,
}

interface User {
    username: string,
    password: string,
}

class App extends Component<AppProps, {}> {
    authorizedAxios : AxiosInstance
    // initialize our state
    constructor(props : AppProps) {
        super(props)
        this.state = {
            newUser: false,
        }
        this.authorizedAxios = Axios.create({ withCredentials: true })
    }

    login = async(data : User) => {
        console.log('logging in')
        const res = await this.authorizedAxios.get(serverUrl + '/login', {
            auth: {
                username: data.username,
                password: data.password,
            },
        })
        CurrentUser.setId(res.data.id)
        this.props.history.push('/home')
    }

    createUser = async(data : User) => {
        console.log('creating user')
        const res = await this.authorizedAxios.post(serverUrl + '/new', {
            username: data.username,
            password: data.password,
        })
        CurrentUser.setId(res.data.id)
        this.props.history.push('/home')
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