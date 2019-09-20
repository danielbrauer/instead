import React, { Component } from 'react'
import Axios, { AxiosInstance } from 'axios'
import AxiosHelper from './AxiosHelper'
import CurrentUser from './CurrentUser'
import UserCache from './UserCache'
import FollowerPage, { FollowerPageProps } from './FollowerPage'
import Posts, { PostsProps } from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect } from 'react-router-dom'
import { readAsArrayBuffer } from 'promise-file-reader'

import { Menu, Dropdown } from 'semantic-ui-react'
import { User } from './Interfaces'
import { History } from 'history'

const toBuffer = require('typedarray-to-buffer')
require('buffer')

const Crypto = window.crypto

const serverUrl = `${process.env.REACT_APP_LOCAL_API_URL}/api` || `/api`

const kBinaryContentType = 'application/octet-stream'

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
        this.userCache = new UserCache(this.getUser, this.addUser, this.authorizedAxios, serverUrl + '/getUserById')
    }

    getUser = (id : number) => {
        return this.state.users[id]
    }

    addUser = (user : User) => {
        let users = {...this.state.users}
        users[user.id] = user
        this.setState({ users: users })
    }

    // when component mounts, first thing it does is fetch all existing data in our db
    async componentDidMount() {
        if (!CurrentUser.loggedIn()) return
        try {
            await Promise.all([this.getConfig(), this.getPosts(), this.updateFollowerList()])
        } catch (error) {
            AxiosHelper.logError(error)
        }
    }

    async updateFollowerList() {
        await Promise.all([this.getFollowRequests(), this.getFollowers()])
    }

    async getConfig() {
        const response = await this.authorizedAxios.get(serverUrl + '/getConfig')
        this.setState({ contentUrl: response.data.config.contentUrl })
    }

    async getPosts() {
        const response = await this.authorizedAxios.get(serverUrl + '/getPosts')
        this.setState({ posts: response.data.posts })
    }

    async getFollowers() {
        const response = await this.authorizedAxios.get(serverUrl + '/getFollowers')
        this.setState({ followers: response.data.followers })
    }

    async getFollowRequests() {
        const response = await this.authorizedAxios.get(serverUrl + '/getFollowRequests')
        this.setState({ followRequests: response.data.requests })
    }

    // our delete method that uses our backend api
    // to remove existing database information
    deleteFromDB = async(idTodelete : number) => {
        await this.authorizedAxios.delete(serverUrl + '/deletePost', {
            params: {
                id: idTodelete,
            },
        })
        this.getPosts()
    }

    async postWithKeys(key : CryptoKey, ivBuffer : Buffer) {
        const exportedKey = await Crypto.subtle.exportKey(
            "jwk",
            key
        )
        return this.authorizedAxios.post(serverUrl + '/createPost', {
            key: exportedKey,
            iv: ivBuffer.toString('base64'),
            fileType: kBinaryContentType,
        })
    }

    // Perform the upload
    handleUpload = async(file : File) => {
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
        // const fileType = Path.extname(file.name).substr(1) // ext includes . separator
        const ivBuffer = toBuffer(iv)
        const encryptedPromise = Crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv,
            },
            key,
            result
        )
        const responsePromise = this.postWithKeys(key, ivBuffer)
        const [encrypted, response] = await Promise.all([encryptedPromise, responsePromise])
        const signedRequest = response.data.data.signedRequest

        // Put the fileType in the headers for the upload
        const options = {
            headers: {
                'Content-Type': kBinaryContentType,
                'Accept': '*/*',
            },
        }
        await Axios.put(signedRequest, encrypted, options)
        this.getPosts()
    }

    follow = async(username : string) => {
        return this.authorizedAxios.post(serverUrl + '/sendFollowRequest', {
            username: username,
        })
    }

    rejectFollowRequest = async(userid : number) => {
        await this.authorizedAxios.post(serverUrl + '/rejectFollowRequest', {
            userid: userid
        })
        this.updateFollowerList()
    }

    acceptFollowRequest = async(userid : number) => {
        await this.authorizedAxios.post(serverUrl + '/acceptFollowRequest', {
            userid: userid
        })
        this.updateFollowerList()
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