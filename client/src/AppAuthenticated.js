import React, { Component } from 'react'
import Axios from 'axios'
import AxiosHelper from './AxiosHelper'
import Path from 'path'
import CurrentUser from './CurrentUser'
import UserCache from './UserCache'
import PostCache from './PostCache'
import FollowerPage from './FollowerPage'
import Posts from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect } from 'react-router-dom'
import toBuffer from 'typedarray-to-buffer'

import { Menu, Dropdown } from 'semantic-ui-react'

require('buffer')

const Crypto = window.crypto

const serverUrl = process.env.REACT_APP_BACKEND_URL + 'api/'

class App extends Component {
    // initialize our state
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            followers: [],
            followRequests: [],
            users: {},
            decryptedPostUrls: {},
            contentUrl: "",
        }
        if (!CurrentUser.loggedIn()) return
        this.authorizedAxios = Axios.create({
            headers: { 'Authorization': `Bearer ${CurrentUser.getToken()}` }
        })
        this.userCache = new UserCache(() => this.state.users, this.addUser, this.authorizedAxios, serverUrl + 'getUserById')
        this.postCache = new PostCache(url => this.state.decryptedPostUrls[url], this.addDecryptedPost)
    }

    addUser = (user) => {
        let users = Object.assign({}, this.state.users)
        users[user._id] = user
        this.setState({ users: users })
    }

    addDecryptedPost = (url, decryptedUrl) => {
        let urls = Object.assign({}, this.state.decryptedPostUrls)
        urls[url] = decryptedUrl
        this.setState({ decryptedPostUrls: urls })
    }

    // when component mounts, first thing it does is fetch all existing data in our db
    componentDidMount = () => {
        if (!CurrentUser.loggedIn()) return
        this.getConfig()
        this.getPosts()
        this.updateFollowerList()
    }

    updateFollowerList = () => {
        this.getFollowRequests()
        this.getFollowers()
    }

    getConfig = () => {
        this.authorizedAxios.get(serverUrl + 'getConfig')
            .then(res => {
                this.setState({ contentUrl: res.data.config.contentUrl })
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    }

    getPosts = () => {
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

    getFollowers = () => {
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

    getFollowRequests = () => {
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
    deleteFromDB = (idTodelete) => {
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
    handleUpload = (file, callback) => {
        file.arrayBuffer().then(buffer => {
            console.log('buffer generated')
            const iv = Crypto.getRandomValues(new Uint8Array(12));
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
                        buffer
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
        })
    }

    follow = (username, callback) => {
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

    rejectFollowRequest = (userid) => {
        this.authorizedAxios.post(serverUrl + 'rejectFollowRequest', {
            userid: userid
        })
            .then(response => {
                this.updateFollowerList()
            })
    }

    acceptFollowRequest = (userid) => {
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
        const postCallbacks = {
            delete: this.deleteFromDB,
            getPostUrl: this.postCache.getDecryptedUrl,
            getUser: this.userCache.getUser,
        }
        const followCallbacks = {
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
                    <Route path='/followers' render={props => <FollowerPage {...props} requests={followRequests} followers={followers} callbacks={followCallbacks} />} />
                    <Route path='/home' render={props => <Posts {...props} posts={posts} contentUrl={contentUrl} callbacks={postCallbacks} />} />
                    <Route path='/new' render={props => <NewPost {...props} onSubmit={this.handleUpload} />} />
                </Switch>
            </div>
        )
    }
}

export default App