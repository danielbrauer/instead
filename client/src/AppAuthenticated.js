import React, { Component } from 'react'
import Axios from 'axios'
import AxiosHelper from './AxiosHelper'
import Path from 'path'
import CurrentUser from './CurrentUser'
import UserCache from './UserCache'

import { Button, List, Image, Header, Menu, Dropdown } from 'semantic-ui-react'
import FollowUserForm from './Components/FollowUserForm'

class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uploadInput: "",
        }
    }
    enableUpload = () => {
        return this.state.uploadInput && this.state.uploadInput.files[0]
    }
    onSubmit = () => {
        this.props.onSubmit(this.state.uploadInput)
    }
    onChange = (event) => {
        this.setState({ uploadInput: event.target })
    }
    render() {
        return (
            <div style={{ padding: '10px' }}>
                <input onChange={this.onChange} type="file" />
                <button onClick={this.onSubmit} disabled={!this.enableUpload()}>Upload</button>
            </div>
        )
    }
}

class App extends Component {
    // initialize our state
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            followers: [],
            followRequests: [],
            users: {},
            contentUrl: "",
        }
        this.authorizedAxios = Axios.create({
            headers: { 'Authorization': `Bearer ${CurrentUser.getToken()}` }
        })
        this.userCache = new UserCache(() => this.state.users, this.addUser, this.authorizedAxios, this.props.serverUrl + 'getUserById')
    }

    addUser = (user) => {
        let users = Object.assign({}, this.state.users)
        users[user._id] = user
        this.setState({ users: users })
    }

    // when component mounts, first thing it does is fetch all existing data in our db
    componentDidMount = () => {
        this.getConfig()
        this.getPosts()
        this.updateFollowerList()
    }

    updateFollowerList = () => {
        this.getFollowRequests()
        this.getFollowers()
    }

    getConfig = () => {
        this.authorizedAxios.get(this.props.serverUrl + 'getConfig')
            .then(res => {
                this.setState({ contentUrl: res.data.config.contentUrl })
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    }

    getPosts = () => {
        this.authorizedAxios.get(this.props.serverUrl + 'getPosts')
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
        this.authorizedAxios.get(this.props.serverUrl + 'getFollowers')
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
        this.authorizedAxios.get(this.props.serverUrl + 'getFollowRequests')
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
        this.authorizedAxios.delete(this.props.serverUrl + 'deletePost', {
            params: {
                id: idTodelete,
            },
        })
            .then(response => {
                this.getPosts()
            })
    }

    // Perform the upload
    handleUpload = (uploadInput) => {
        const file = uploadInput.files[0]
        const fileType = Path.extname(file.name).substr(1) // ext includes . separator
        this.authorizedAxios.post(this.props.serverUrl + 'createPost', {
            fileType: fileType,
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
                Axios.put(signedRequest, file, options)
                    .then(response => {
                        this.getPosts()
                    })
            })
    }

    follow = (username, callback) => {
        this.authorizedAxios.post(this.props.serverUrl + 'sendFollowRequest', {
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
        this.authorizedAxios.post(this.props.serverUrl + 'rejectFollowRequest', {
            userid: userid
        })
            .then(response => {
                this.updateFollowerList()
            })
    }

    acceptFollowRequest = (userid) => {
        this.authorizedAxios.post(this.props.serverUrl + 'acceptFollowRequest', {
            userid: userid
        })
            .then(response => {
                this.updateFollowerList()
            })
    }

    logOut = () => {
        CurrentUser.clearToken()
        this.props.setLoggedIn(false)
    }

    render() {
        const { posts, followers, followRequests, contentUrl } = this.state
        return (
            <div>
                <Menu inverted fixed='top' size='small'>
                    <Menu.Item header>
                        Instead
                    </Menu.Item>
                    <Menu.Item fitted position='right'>
                        <Dropdown item direction='left' text={this.userCache.getUser(CurrentUser.getPayload().userid).username}>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={this.logOut}>Log Out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
                <br/>
                <br/>
                <List>
                    {posts.map((post) => (
                        <List.Item key={post._id}>
                            {CurrentUser.getPayload().userid === post.userid ?
                                <Button onClick={() => this.deleteFromDB(post._id)}>Delete</Button> : null}
                            <List.Content>{this.userCache.getUser(post.userid).username}</List.Content>
                            <Image fluid src={contentUrl + post._id} alt={post._id} />
                        </List.Item>
                    ))}
                </List>
                <Add onSubmit={this.handleUpload} />
                <FollowUserForm callback={this.follow} />
                <List>
                    {followRequests.map((request) => (
                        <List.Item key={request.requesterId}>
                            <Button onClick={() => this.acceptFollowRequest(request.requesterId)}>accept</Button>
                            <Button onClick={() => this.rejectFollowRequest(request.requesterId)}>reject</Button>
                            <List.Content>{this.userCache.getUser(request.requesterId).username}</List.Content>
                        </List.Item>
                    ))}
                </List>
                <Header>Followers</Header>
                <List>
                    {followers.map(follower => (
                        <List.Item key={follower}>
                            <List.Content>{this.userCache.getUser(follower).username}</List.Content>
                        </List.Item>
                    ))}
                </List>
            </div>
        )
    }
}

export default App