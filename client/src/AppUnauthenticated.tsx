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
const toBuffer = require('typedarray-to-buffer') as (x: any) => Buffer
const hkdf = require('futoin-hkdf') as (ikm: string, length: number, { salt, info, hash} : {salt : string, info: string, hash : string}) => Buffer
const xor = require('buffer-xor') as (a: Buffer, b: Buffer) => Buffer

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

    async derivePrivateKey(salt : string, password : string, secretKey : string, username : string) {
        const scryptOptions : ScryptOptions = {
            N: 16384,
            r: 8,
            p: 1,
            dkLen: 32,
            encoding: 'binary'
        }
        const keyParts = secretKey.split('-')
        const version = keyParts.shift()!
        const key = keyParts.join()

        const passwordBuffer = Buffer.from(password.trim().normalize('NFKC'))

        const saltedSalt = hkdf(salt, 32, {salt: username, info: version, hash: 'SHA-256'})
        const hashedPassword = toBuffer(await scrypt(passwordBuffer, saltedSalt, scryptOptions))
        const saltedKey = hkdf(key, 32, {salt: username, info: version, hash: 'SHA-256'})

        return xor(hashedPassword, saltedKey).toString('hex')
    }

    login = async(info : LoginInfo) => {
        console.log('logging in')
        const clientEphemeral = srp.generateEphemeral()
        const startRes = await this.authorizedAxios.post(serverUrl + '/startLogin', {
            username: info.username,
            clientEphemeralPublic: clientEphemeral.public,
        })
        const { srpSalt, serverEphemeralPublic } = startRes.data
        const srpKey = await this.derivePrivateKey(srpSalt, info.password, info.secretKey, info.username)
        const clientSession = srp.deriveSession(clientEphemeral.secret, serverEphemeralPublic, srpSalt, info.username, srpKey)
        const finishRes = await this.authorizedAxios.post(serverUrl + '/finishLogin', {
            clientSessionProof: clientSession.proof,
        })
        const { serverSessionProof, userid } = finishRes.data
        srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof)
        CurrentUser.set(userid, info.username, info.secretKey)
        this.props.history.push('/home')
    }

    createSecretKey() : string {
        const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
        const values = Crypto.getRandomValues(new Uint8Array(26))
        let output = ''
        values.forEach(x => output += characters.charAt(x%32))
        return 'A1-' + output
    }

    createUser = async(info : NewUserInfo) => {
        console.log('creating user')
        const startRes = await this.authorizedAxios.get(serverUrl + '/startSignup')

        const { username } = startRes.data

        const srpSalt = toBuffer(Crypto.getRandomValues(new Uint8Array(16))).toString('hex')
        const secretKey = this.createSecretKey()
        const srpKey = await this.derivePrivateKey(srpSalt, info.password, secretKey, username)
        const verifier = srp.deriveVerifier(srpKey)

        const mukSalt = toBuffer(Crypto.getRandomValues(new Uint8Array(16))).toString('hex')
        const muk = await this.derivePrivateKey(mukSalt, info.password, secretKey, username)
        // @ts-ignore
        const mukJwk = await Crypto.subtle.importKey(
            'raw',
            Buffer.from(muk, 'hex'),
            // @ts-ignore
            { name: 'AES-GCM'},
            false,
            ["encrypt", "decrypt", 'wrapKey', 'unwrapKey']
        )
        const keyParams: RsaHashedKeyGenParams = {
            name: 'RSA-OAEP',
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: 'SHA-256',
        }
        const accountKeys = await Crypto.subtle.generateKey(
            keyParams,
            true,
            ["encrypt", "decrypt"]
        )
        const exportedPublic = await Crypto.subtle.exportKey(
            'jwk',
            accountKeys.publicKey
        )
        const accountPrivateIv = Crypto.getRandomValues(new Uint8Array(12))
        const wrappedPrivate = await Crypto.subtle.wrapKey(
            'jwk',
            accountKeys.privateKey,
            mukJwk,
            // @ts-ignore
            { name: 'AES-GCM', iv: accountPrivateIv}
        )
        const finishRes = await this.authorizedAxios.post(serverUrl + '/finishSignup', {
            displayName: info.displayName,
            srpSalt,
            verifier,
            mukSalt,
            publicKey: exportedPublic,
            privateKey: Buffer.from(wrappedPrivate).toString('hex'),
            privateKeyIv: Buffer.from(accountPrivateIv).toString('hex')
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