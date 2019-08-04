import React, { Component } from 'react';
import Axios from 'axios';
import Path from 'path';
import User from './User'

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
    onSelect = (ref) => {
        this.setState({ uploadInput: ref });
    }
    render() {
        return (
            <div style={{ padding: '10px' }}>
                <input ref={this.onSelect} type="file" />
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

class ImageItem extends Component {
    render() {
        return (
            <li style={{ padding: '10px' }} key={this.props.data.id}>
                <Delete onSubmit={this.props.onDelete} idToDelete={this.props.data.id} />
                <br />
                <img src={this.props.url + this.props.data.fileName} alt={this.props.data.id} width="200" height="200" />
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
            id: 0,
            message: null,
            intervalIsSet: false,
            contentUrl: "",
        }
    }

    // when component mounts, first thing it does is fetch all existing data in our db
    // then we incorporate a polling logic so that we can easily see if our db has
    // changed and implement those changes into our UI
    componentDidMount() {
        Axios.defaults.headers.common['Authorization'] = `Bearer ${User.getToken()}`;
        this.getConfig();
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            const interval = setInterval(this.getDataFromDb, 1000)
            this.setState({ intervalIsSet: interval })
        }
    }

    // never let a process live forever
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet)
            this.setState({ intervalIsSet: null })
        }
    }

    getConfig = () => {
        Axios.get(this.props.serverUrl + 'getConfig')
            .then(res => {
                this.setState({ contentUrl: res.data.config.contentUrl })
            })
            .catch(error => {
                console.warn(error.message)
            })
    }

    // our first get method that uses our backend api to
    // fetch data from our data base
    getDataFromDb = () => {
        Axios.get(this.props.serverUrl + 'getData')
            .then(res => {
                if (res.data.data)
                    this.setState({ data: res.data.data })
            })
            .catch(error => {
                console.warn(error.message)
            })
    };

    // our put method that uses our backend api
    // to create new query into our data base
    putDataToDB = (record) => {
        const currentIds = this.state.data.map((data) => data.id);
        let idToBeAdded = 0;
        while (currentIds.includes(idToBeAdded)) {
            ++idToBeAdded;
        }

        Axios.post(this.props.serverUrl + 'putData', {
            id: idToBeAdded,
            fileName: record.fileName,
        });
    };

    // our delete method that uses our backend api
    // to remove existing database information
    deleteFromDB = (idTodelete) => {
        let objIdToDelete = null;
        this.state.data.forEach((dat) => {
            if (dat.id === parseInt(idTodelete)) {
                objIdToDelete = dat._id;
            }
        });

        Axios.delete(this.props.serverUrl + 'deleteData', {
            data: {
                id: objIdToDelete,
            },
        });
    };

    // Perform the upload
    handleUpload = (uploadInput) => {
        const file = uploadInput.files[0];
        const fileType = Path.extname(file.name).substr(1) // ext includes . separator
        Axios.post(this.props.serverUrl + 'getUploadUrl', {
            fileType: fileType,
        })
            .then(response => {
                const returnData = response.data.data;
                const signedRequest = returnData.signedRequest;
                const fileName = returnData.fileName;

                // Put the fileType in the headers for the upload
                const options = {
                    headers: {
                        'Content-Type': fileType
                    }
                };
                Axios.put(signedRequest, file, options)
                    .then(result => {
                        this.putDataToDB({ fileName: fileName });
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
                <ul>
                    {data.length === 0
                        ? 'NO DB ENTRIES YET'
                        : data.map((dat) => (
                            <ImageItem data={dat} url={contentUrl} onDelete={this.deleteFromDB} key={dat.id} />
                        ))}
                </ul>
                <Add onSubmit={this.handleUpload} />
            </div>
        );
    }
}

export default App