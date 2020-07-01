import React, { Component } from 'react'
import Axios, { AxiosInstance } from 'axios'
import AxiosHelper from './AxiosHelper'
import CurrentUser from './CurrentUser'
import UserCache from './UserCache'
import FollowerPage, { FollowerPageProps } from './FollowerPage'
import Posts, { PostsProps } from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'
import { readAsArrayBuffer } from 'promise-file-reader'

import { Menu, Dropdown } from 'semantic-ui-react'
import { User, Post } from './Interfaces'
import config from './config'

const serverUrl = `${config.serverUrl}/api`

const toBuffer = require('typedarray-to-buffer')
require('buffer')
const md5 = require('js-md5')

const Crypto = window.crypto

const kBinaryContentType = 'application/octet-stream'

interface AppState {
    posts: Post[],
    followers: never[],
    followees: never[],
    followRequests: never[],
    users: { [id: string]: User },
    decryptedPostUrls: { [id: string]: string },
    contentUrl: string,
}

class App extends Component<RouteComponentProps<any>, AppState> {
    authorizedAxios: AxiosInstance
    userCache: UserCache
    // initialize our state
    constructor(props: RouteComponentProps<any>) {
        super(props)
        this.state = {
            posts: [],
            followers: [],
            followees: [],
            followRequests: [],
            users: {},
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
        this.userCache = new UserCache(this.getUser, this.addUser, this.authorizedAxios, serverUrl + '/getUserById')
    }

    getUser = (id: number) => {
        return this.state.users[id]
    }

    addUser = (user: User) => {
        let users = { ...this.state.users }
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
        await Promise.all([this.getFollowRequests(), this.getFollowers(), this.getFollowees()])
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
        const response = await this.authorizedAxios.get(serverUrl + '/getFollowerIds')
        this.setState({ followers: response.data.followers })
    }

    async getFollowees() {
        const response = await this.authorizedAxios.get(serverUrl + '/getFollowees')
        this.setState({ followees: response.data.followees })
    }

    async getFollowRequests() {
        const response = await this.authorizedAxios.get(serverUrl + '/getFollowRequests')
        this.setState({ followRequests: response.data.requests })
    }

    // our delete method that uses our backend api
    // to remove existing database information
    deleteFromDB = async (idTodelete: number) => {
        await this.authorizedAxios.delete(serverUrl + '/deletePost', {
            params: {
                id: idTodelete,
            },
        })
        this.getPosts()
    }

    async postWithKeys(key: CryptoKey, ivBuffer: Buffer, contentMd5: string) {
        const exportedKey = await Crypto.subtle.exportKey(
            "jwk",
            key
        )
        return this.authorizedAxios.post(serverUrl + '/createPost', {
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
        const response = await this.postWithKeys(key, ivBuffer, contentMD5)
        const signedRequest = response.data.data.signedRequest

        // Put the fileType in the headers for the upload
        const options = {
            headers: {
                'Content-Type': kBinaryContentType,
                'Content-MD5': contentMD5,
            },
        }
        await Axios.put(signedRequest, encrypted, options)
        this.getPosts()
    }

    follow = async (username: string) => {
        return this.authorizedAxios.post(serverUrl + '/sendFollowRequest', {
            username: username,
        })
    }

    rejectFollowRequest = async (userid: number) => {
        await this.authorizedAxios.post(serverUrl + '/rejectFollowRequest', {
            userid: userid
        })
        this.updateFollowerList()
    }

    unfollow = async (userid: number) => {
        await this.authorizedAxios.post(serverUrl + '/unfollow', {
            userid: userid
        })
        this.updateFollowerList()
    }

    removeFollower = async (userid: number) => {
        await this.authorizedAxios.post(serverUrl + '/removeFollower', {
            userid: userid
        })
        this.updateFollowerList()
    }

    acceptFollowRequest = async (userid: number) => {
        await this.authorizedAxios.post(serverUrl + '/acceptFollowRequest', {
            userid: userid
        })
        this.updateFollowerList()
    }

    logOut = async () => {
        try {
            await this.authorizedAxios.get(serverUrl + '/logout')
        } finally {
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
        const { posts, followers, followees, followRequests, contentUrl } = this.state
        const postsProps: PostsProps = {
            posts: posts,
            contentUrl: contentUrl,
            delete: this.deleteFromDB,
            getUser: this.userCache.getUser,
        }
        const followProps: FollowerPageProps = {
            requests: followRequests,
            followers,
            followees,
            follow: this.follow,
            accept: this.acceptFollowRequest,
            reject: this.rejectFollowRequest,
            unfollow: this.unfollow,
            removeFollower: this.removeFollower,
            getUser: this.userCache.getUser,
        }
        return (
            <div>
                <Menu inverted fixed='top' size='small'>
                    <Menu.Item header>
                        Instead
                    </Menu.Item>
                    <Menu.Item fitted position='right'>
                        <Dropdown item direction='left' text={this.userCache.getUser(CurrentUser.getId()).username}>
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
                    <Route path='/followers' render={props => <FollowerPage {...props} {...followProps} />} />
                    <Route path='/following' render={props => <FollowerPage {...props} {...followProps} />} />
                    <Route path='/requests' render={props => <FollowerPage {...props} {...followProps} />} />
                    <Route path='/home' render={props => <Posts {...props} {...postsProps} />} />
                    <Route path='/new' render={props => <NewPost {...props} onSubmit={this.handleUpload} />} />
                </Switch>
            </div>
        )
    }
}

export default App