import React, { Component } from 'react';
import axios from 'axios';

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
    this.setState({uploadInput: ref});
  }
  render() {
    return(
      <div style={{ padding: '10px' }}>
        <input ref={this.onSelect} type="file"/>
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
    return(
      <li style={{ padding: '10px' }} key={this.props.data.id}>
        <Delete onSubmit={this.props.onDelete} idToDelete={this.props.data.id}/>
        <br/>
        <img src={this.props.data.message} alt={this.props.data.id} width="200" height="200"/>
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
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null,
    }
  }

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message,
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

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach((dat) => {
      if (dat.id === parseInt(idToUpdate)) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };

  // Perform the upload
  handleUpload = (uploadInput) => {
    const file = uploadInput.files[0];
    // Split the filename to get the name and type
    const fileParts = uploadInput.files[0].name.split('.');
    const fileName = fileParts[0];
    const fileType = fileParts[1];
    console.log("Preparing the upload");
    axios.post("http://localhost:3001/api/getUploadUrl",{
      fileName : fileName,
      fileType : fileType
    })
    .then(response => {
      const returnData = response.data.data.returnData;
      const signedRequest = returnData.signedRequest;
      const url = returnData.url;
      console.log("Recieved a signed request " + signedRequest);
      
     // Put the fileType in the headers for the upload
      const options = {
        headers: {
          'Content-Type': fileType
        }
      };
      axios.put(signedRequest,file,options)
      .then(result => {
        console.log("Response from s3")

        this.putDataToDB(url);
      })
      .catch(error => {
        alert("ERROR " + JSON.stringify(error));
      })
    })
    .catch(error => {
      alert(JSON.stringify(error));
    })
  }

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length === 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
              <ImageItem data={dat} onDelete={this.deleteFromDB} key={dat.id}/>
              ))}
        </ul>
        <Add onSubmit={this.handleUpload}/>
      </div>
    );
  }
}

export default App;