import React, { Component } from 'react'
import Axios, { AxiosInstance } from 'axios'
import AxiosHelper from './AxiosHelper'
import CurrentUser from './CurrentUser'
import FollowerPage from './FollowerPage'
import Posts, { PostsProps } from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'
import { readAsArrayBuffer } from 'promise-file-reader'

import { Menu, Dropdown } from 'semantic-ui-react'
import config from './config'
import { queryCache } from 'react-query'

const serverUrl = `${config.serverUrl}/api`

const toBuffer = require('typedarray-to-buffer')
require('buffer')
const md5 = require('js-md5')

const Crypto = window.crypto

const kBinaryContentType = 'application/octet-stream'

interface AppState {
    decryptedPostUrls: { [id: string]: string },
    contentUrl: string,
}

class App extends Component<RouteComponentProps<any>, AppState> {
    authorizedAxios: AxiosInstance
    // initialize our state
    constructor(props: RouteComponentProps<any>) {
        super(props)
        this.state = {
            decryptedPostUrls: {},
            contentUrl: "",
        }
        this.authorizedAxios = Axios.create({ withCredentials: true })
        this.authorizedAxios.interceptors.response.use(response => {
            return response
        }, error => {
            if (error.response?.status === 401) {
                console.log('Not logged in')
                this.goToLogin()
            }
            return Promise.reject(error)
        })
    }

    // when component mounts, first thing it does is fetch all existing data in our db
    async componentDidMount() {
        if (!CurrentUser.loggedIn()) return
        try {
            await Promise.all([this.getConfig()])
        } catch (error) {
            AxiosHelper.logError(error)
        }
    }

    async getConfig() {
        const response = await this.authorizedAxios.get(serverUrl + '/getConfig')
        this.setState({ contentUrl: response.data.config.contentUrl })
    }

    async postWithKeys(key: CryptoKey, ivBuffer: Buffer, contentMd5: string) {
        const exportedKey = await Crypto.subtle.exportKey(
            "jwk",
            key
        )
        return this.authorizedAxios.post(serverUrl + '/startPost', {
            key: exportedKey,
            iv: ivBuffer.toString('base64'),
            md5: contentMd5
        })
    }

    // Perform the upload
    handleUpload = async (file: File) => {
        const filePromise = readAsArrayBuffer(file)
        const keyPromise = Crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        )
        const iv = Crypto.getRandomValues(new Uint8Array(12))
        const [result, key] = await Promise.all([filePromise, keyPromise])
        const ivBuffer = toBuffer(iv)
        const encrypted = await Crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv,
            },
            key,
            result
        )
        const contentMD5 = md5.base64(encrypted)
        const postResponse = await this.postWithKeys(key, ivBuffer, contentMD5)
        const signedRequest = postResponse.data.signedRequest

        const options = {
            headers: {
                'Content-Type': kBinaryContentType,
                'Content-MD5': contentMD5,
            },
        }
        let success = true
        try {
            await Axios.put(signedRequest, encrypted, options)
        } catch (error) {
            success = false
        }
        await this.authorizedAxios.post(serverUrl + '/finishPost', {
            postId: postResponse.data.postId,
            success
        })
        // this.getPosts()
        return success
    }

    logOut = async () => {
        try {
            await this.authorizedAxios.get(serverUrl + '/logout')
        } finally {
            queryCache.clear()
            this.goToLogin()
        }
    }

    goToLogin = () => {
        CurrentUser.clear()
        this.props.history.push('/login')
    }

    render() {
        if (!CurrentUser.loggedIn())
            return (<Redirect to='/login' />)
        // const currentUser = useQuery(['user', CurrentUser.getId()], Routes.getUser)
        const { contentUrl } = this.state
        const postsProps: PostsProps = {
            contentUrl: contentUrl,
        }
        return (
            <div>
                <Menu inverted fixed='top' size='small'>
                    <Menu.Item header>
                        Instead
                    </Menu.Item>
                    <Menu.Item fitted position='right'>
                        <Dropdown item direction='left' text='{currentUser.data?.username}'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='list' text='Home' onClick={() => this.props.history.push('/home')}/>
                                <Dropdown.Item icon='image' text='New Post' onClick={() => this.props.history.push('/new')}/>
                                <Dropdown.Item icon='user' text='Followers' onClick={() => this.props.history.push('/followers')}/>
                                <Dropdown.Divider />
                                <Dropdown.Item icon='sign-out' text='Log Out' onClick={this.logOut}/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
                <br />
                <br />
                <Switch>
                    <Route path='/followers' render={props => <FollowerPage {...props}/>} />
                    <Route path='/following' render={props => <FollowerPage {...props} />} />
                    <Route path='/requests' render={props => <FollowerPage {...props} />} />
                    <Route path='/home' render={props => <Posts {...props} {...postsProps} />} />
                    <Route path='/new' render={props => <NewPost {...props} onSubmit={this.handleUpload} />} />
                </Switch>
            </div>
        )
    }
}

export default App