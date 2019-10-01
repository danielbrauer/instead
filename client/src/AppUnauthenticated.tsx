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
import scrypt, { ScryptOptions } from 'scrypt-async-modern'
import { Buffer } from 'buffer'
import { LoginInfo, NewUserInfo } from './Interfaces'
const toBuffer = require('typedarray-to-buffer')

const Crypto = window.crypto

const serverUrl = `${config.serverUrl}/auth`

export interface AppProps {
    history: History,
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

    async derivePrivateKey(salt : string, password : string, secretKey : string) {
        const scryptOptions : ScryptOptions = {
            N: 16384,
            r: 8,
            p: 1,
            dkLen: 16,
            encoding: 'hex'
        }
        const passwordBuffer = Buffer.from(password.trim().normalize('NFKC'))
        const saltBuffer = Buffer.from(salt, 'hex')
        const secretKeyBuffer = Buffer.from(secretKey)
        const keyAndPassword = Buffer.concat([secretKeyBuffer, passwordBuffer])
        return await scrypt(keyAndPassword, saltBuffer, scryptOptions)
    }

    login = async(info : LoginInfo) => {
        console.log('logging in')
        try {
            const clientEphemeral = srp.generateEphemeral()
            const startRes = await this.authorizedAxios.post(serverUrl + '/startLogin', {
                username: info.username,
                clientEphemeralPublic: clientEphemeral.public,
            })
            const { salt, serverEphemeralPublic } = startRes.data
            const privateKey = await this.derivePrivateKey(salt, info.password, info.secretKey)
            const clientSession = srp.deriveSession(clientEphemeral.secret, serverEphemeralPublic, salt, info.username, privateKey)
            const finishRes = await this.authorizedAxios.post(serverUrl + '/finishLogin', {
                clientSessionProof: clientSession.proof,
            })
            const { serverSessionProof, userid } = finishRes.data
            srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof)
            CurrentUser.set(userid, info.username, info.secretKey)
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

    createSecretKey() : string {
        const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
        const values = Crypto.getRandomValues(new Uint8Array(26))
        let output = ''
        values.forEach(x => output += characters.charAt(x%32))
        return output
    }

    createUser = async(info : NewUserInfo) => {
        console.log('creating user')
        const startRes = await this.authorizedAxios.get(serverUrl + '/startSignup')
        const { username } = startRes.data
        const salt = toBuffer(Crypto.getRandomValues(new Uint8Array(16))).toString('hex')
        const secretKey = this.createSecretKey()
        const privateKey = await this.derivePrivateKey(salt, info.password, secretKey)
        const verifier = srp.deriveVerifier(privateKey)
        
        const finishRes = await this.authorizedAxios.post(serverUrl + '/finishSignup', {
            displayName: info.displayName,
            salt,
            verifier,
        })
        const { id } = finishRes.data.user
        CurrentUser.set(id, username, secretKey)
        this.props.history.push('/welcome')
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