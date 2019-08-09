import React, { Component } from 'react';
import Axios from 'axios';
import AxiosHelper from './AxiosHelper'
import Path from 'path';
import User from './User'
import jwt from 'jsonwebtoken'

class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadInput: "",
        }
    }
    enableUpload = () => {
        return this.state.uploadInput && this.state.uploadInput.files[0];
    }
    onSubmit = () => {
        this.props.onSubmit(this.state.uploadInput);
    }
    onSelect = (event) => {
        this.setState({ uploadInput: event.target });
    }
    render() {
        return (
            <div style={{ padding: '10px' }}>
                <input onChange={this.onSelect} type="file" />
                <button onClick={this.onSubmit} disabled={!this.enableUpload()}>Upload</button>
            </div>
        );
    }
}

class Delete extends Component {
    onSubmit = () => {
        this.props.onSubmit(this.props.idToDelete);
    }
    render() {
        return (
            <div style={{ padding: '10px' }}>
                <button onClick={this.onSubmit}>
                    DELETE
        </button>
            </div>
        );
    }
}

class PostItem extends Component {
    render() {
        return (
            <li style={{ padding: '10px' }} key={this.props.data._id}>
                <Delete onSubmit={this.props.onDelete} idToDelete={this.props.data._id} />
                {this.props.data.userid}
                <br />
                <img src={this.props.url + this.props.data._id} alt={this.props.data._id} width="200" height="200" />
            </li>
        )
    }
}

class App extends Component {
    // initialize our state
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            contentUrl: "",
        }
    }

    // when component mounts, first thing it does is fetch all existing data in our db
    componentDidMount() {
        this.authorizedAxios = Axios.create({
            headers: {'Authorization': `Bearer ${User.getToken()}`}
        })
        // Axios.defaults.headers.common['Authorization'] = `Bearer ${User.getToken()}`;
        this.getConfig()
        this.getDataFromDb()
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

    // our first get method that uses our backend api to
    // fetch data from our data base
    getDataFromDb = () => {
        this.authorizedAxios.get(this.props.serverUrl + 'getPosts')
            .then(res => {
                if (res.data.data)
                    this.setState({ data: res.data.data })
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    };

    // our delete method that uses our backend api
    // to remove existing database information
    deleteFromDB = (idTodelete) => {
        let objIdToDelete = null
        this.state.data.forEach((dat) => {
            if (dat.id === parseInt(idTodelete)) {
                objIdToDelete = dat._id
            }
        })

        this.authorizedAxios.delete(this.props.serverUrl + 'deletePost', {
            data: {
                id: objIdToDelete,
            },
        })
        .then(response => {
            this.getDataFromDb()
        })
    };

    // Perform the upload
    handleUpload = (uploadInput) => {
        const file = uploadInput.files[0];
        const fileType = Path.extname(file.name).substr(1) // ext includes . separator
        this.authorizedAxios.post(this.props.serverUrl + 'createPost', {
            fileType: fileType,
        })
        .then(response => {
            const returnData = response.data.data;
            const signedRequest = returnData.signedRequest;

            // Put the fileType in the headers for the upload
            const options = {
                headers: {
                    'Content-Type': fileType,
                },
            };
            Axios.put(signedRequest, file, options)
            .then(response => {
                this.getDataFromDb()
            })
        })
    }

    logOut = () => {
        User.clearToken()
        this.props.setLoggedIn(false)
    }

    render() {
        const { data, contentUrl } = this.state;
        return (
            <div>
                <button onClick={this.logOut}>Log Out</button>
                {jwt.decode(User.getToken()).username}
                <ul>
                    {data.length === 0
                        ? 'NO DB ENTRIES YET'
                        : data.map((dat) => (
                            <PostItem data={dat} url={contentUrl} onDelete={this.deleteFromDB} key={dat._id} />
                        ))}
                </ul>
                <Add onSubmit={this.handleUpload} />
            </div>
        );
    }
}

export default App