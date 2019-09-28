import React, { Component } from 'react'
import Axios, { AxiosInstance } from 'axios'
import CurrentUser from './CurrentUser'
import LoginForm from './Components/LoginForm'
import NewUserForm from './Components/NewUserForm'
import { Grid } from 'semantic-ui-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { History } from 'history'
import config from './config'
import srp from 'secure-remote-password/client'

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

    login = async(user : User) => {
        console.log('logging in')
        try {
            const clientEphemeral = srp.generateEphemeral()
            const startRes = await this.authorizedAxios.post(serverUrl + '/startLogin', {
                username: user.username,
                clientEphemeralPublic: clientEphemeral.public,
            })
            const { salt, serverEphemeralPublic } = startRes.data
            const privateKey = srp.derivePrivateKey(salt, user.username, user.password)
            const clientSession = srp.deriveSession(clientEphemeral.secret, serverEphemeralPublic, salt, user.username, privateKey)
            const finishRes = await this.authorizedAxios.post(serverUrl + '/finishLogin', {
                clientSessionProof: clientSession.proof,
            })
            const { serverSessionProof, userid } = finishRes.data
            srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof)
            CurrentUser.setId(userid)
            this.props.history.push('/home')
        } catch (error) {
            try {
                await this.authorizedAxios.get(serverUrl + '/cancelLogin')
                console.log('canceled login')
            } catch (error) {
                throw new Error('Authentication failed and can\'t cancel session')
            }
            throw new Error('Authentication failed')
        }
    }

    createUser = async(user : User) => {
        console.log('creating user')
        const salt = srp.generateSalt()
        const privateKey = srp.derivePrivateKey(salt, user.username, user.password)
        const verifier = srp.deriveVerifier(privateKey)
        const res = await this.authorizedAxios.post(serverUrl + '/new', {
            username: user.username,
            salt,
            verifier,
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