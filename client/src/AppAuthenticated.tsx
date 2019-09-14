import React, { Component } from 'react'
import Axios, { AxiosInstance } from 'axios'
import AxiosHelper from './AxiosHelper'
import Path from 'path'
import CurrentUser from './CurrentUser'
import UserCache from './UserCache'
import FollowerPage, { FollowerPageProps } from './FollowerPage'
import Posts, { PostsProps } from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Menu, Dropdown } from 'semantic-ui-react'
import { User } from './Interfaces'
import { History } from 'history'

const toBuffer = require('typedarray-to-buffer')
require('buffer')

const Crypto = window.crypto

const serverUrl = process.env.REACT_APP_BACKEND_URL + 'api/'

export interface AppProps {
    history: History,
}

interface AppState {
    posts: never[],
    followers: never[],
    followRequests: never[],
    users: { [id: string] : User},
    decryptedPostUrls: { [id: string] : string},
    contentUrl: string,
}

class App extends Component<AppProps, AppState> {
    authorizedAxios: AxiosInstance
    userCache: UserCache
    // initialize our state
    constructor(props : AppProps) {
        super(props)
        this.state = {
            posts: [],
            followers: [],
            followRequests: [],
            users: {},
            decryptedPostUrls: {},
            contentUrl: "",
        }
        this.authorizedAxios = Axios.create({
            headers: { 'Authorization': `Bearer ${CurrentUser.getToken()}` }
        })
        this.userCache = new UserCache(this.getUser, this.addUser, this.authorizedAxios, serverUrl + 'getUserById')
        if (!CurrentUser.loggedIn()) return
    }

    getUser = (id : string) => {
        return this.state.users[id]
    }

    addUser = (user : User) => {
        let users = {...this.state.users}
        users[user._id] = user
        this.setState({ users: users })
    }

    // when component mounts, first thing it does is fetch all existing data in our db
    componentDidMount() {
        if (!CurrentUser.loggedIn()) return
        this.getConfig()
        this.getPosts()
        this.updateFollowerList()
    }

    updateFollowerList() {
        this.getFollowRequests()
        this.getFollowers()
    }

    getConfig() {
        this.authorizedAxios.get(serverUrl + 'getConfig')
            .then(res => {
                this.setState({ contentUrl: res.data.config.contentUrl })
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    }

    getPosts() {
        this.authorizedAxios.get(serverUrl + 'getPosts')
            .then(res => {
                if (res.data.posts) {
                    this.setState({ posts: res.data.posts })
                }
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    }

    getFollowers() {
        this.authorizedAxios.get(serverUrl + 'getFollowers')
            .then(res => {
                if (res.data.followers) {
                    this.setState({ followers: res.data.followers })
                }
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    }

    getFollowRequests() {
        this.authorizedAxios.get(serverUrl + 'getFollowRequests')
            .then(res => {
                if (res.data.requests) {
                    this.setState({ followRequests: res.data.requests })
                }
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    }

    // our delete method that uses our backend api
    // to remove existing database information
    deleteFromDB = (idTodelete : string) => {
        this.authorizedAxios.delete(serverUrl + 'deletePost', {
            params: {
                id: idTodelete,
            },
        })
            .then(response => {
                this.getPosts()
            })
    }

    // Perform the upload
    handleUpload = (file : File, callback : () => void) => {
        const fileReader = new FileReader()

        fileReader.onload = () => {
            console.log('buffer generated')
            const iv = Crypto.getRandomValues(new Uint8Array(12))
            Crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 256
                },
                true,
                ["encrypt", "decrypt"]
            ).then(key => {
                console.log('key generated')
                Crypto.subtle.exportKey(
                    "jwk",
                    key
                ).then(exportedKey => {
                    Crypto.subtle.encrypt(
                        {
                            name: "AES-GCM",
                            iv,
                        },
                        key,
                        fileReader.result as ArrayBuffer
                    ).then(encrypted => {
                        console.log('blob encrypted')
                        const fileType = Path.extname(file.name).substr(1) // ext includes . separator
                        const ivBuffer = toBuffer(iv)
                        this.authorizedAxios.post(serverUrl + 'createPost', {
                            fileType: fileType,
                            key: JSON.stringify(exportedKey),
                            iv: ivBuffer.toString('base64'),
                        })
                            .then(response => {
                                const returnData = response.data.data
                                const signedRequest = returnData.signedRequest
            
                                // Put the fileType in the headers for the upload
                                const options = {
                                    headers: {
                                        'Content-Type': fileType,
                                    },
                                }
                                Axios.put(signedRequest, encrypted, options)
                                    .then(response => {
                                        this.getPosts()
                                        callback()
                                    })
                            })
                    })
                })
            })
        }
        fileReader.readAsArrayBuffer(file)
    }

    follow = (username : string, callback : (arg0: boolean, arg1: string) => void) => {
        this.authorizedAxios.post(serverUrl + 'sendFollowRequest', {
            username: username,
        })
            .then(response => {
                callback(true, "Request sent")
            })
            .catch(error => {
                callback(false, error.response.data)
            })
    }

    rejectFollowRequest = (userid : string) => {
        this.authorizedAxios.post(serverUrl + 'rejectFollowRequest', {
            userid: userid
        })
            .then(response => {
                this.updateFollowerList()
            })
    }

    acceptFollowRequest = (userid : string) => {
        this.authorizedAxios.post(serverUrl + 'acceptFollowRequest', {
            userid: userid
        })
            .then(response => {
                this.updateFollowerList()
            })
    }

    logOut = () => {
        CurrentUser.clearToken()
        this.props.history.push('/login')
    }

    render() {
        if (!CurrentUser.loggedIn())
            return (<Redirect to='/login' />)
        const { posts, followers, followRequests, contentUrl } = this.state
        const postsProps : PostsProps = {
            posts: posts,
            contentUrl: contentUrl,
            delete: this.deleteFromDB,
            getUser: this.userCache.getUser,
        }
        const followProps : FollowerPageProps = {
            requests: followRequests,
            followers,
            follow: this.follow,
            accept: this.acceptFollowRequest,
            reject: this.rejectFollowRequest,
            getUser: this.userCache.getUser,
        }
        return (
            <div>
                <Menu inverted fixed='top' size='small'>
                    <Menu.Item header>
                        Instead
                    </Menu.Item>
                    <Menu.Item fitted position='right'>
                        <Dropdown item direction='left' text={this.userCache.getUser(CurrentUser.getPayload().userid).username}>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => this.props.history.push('/home')}>Home</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.history.push('/new')}>New Post</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.history.push('/followers')}>Followers</Dropdown.Item>
                                <Dropdown.Item onClick={this.logOut}>Log Out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
                <br />
                <br />
                <Switch>
                    <Route path='/followers' render={props => <FollowerPage {...props} {...followProps} />} />
                    <Route path='/home' render={props => <Posts {...props} {...postsProps} />} />
                    <Route path='/new' render={props => <NewPost {...props} onSubmit={this.handleUpload} />} />
                </Switch>
            </div>
        )
    }
}

export default App