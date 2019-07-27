import React, { Component } from 'react';
import axios from 'axios';

class Add extends Component {
  onSubmit = () => {
    this.props.onSubmit(this.state.message);
  }
  render() {
    return(
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          onChange={(e) => this.setState({ message: e.target.value })}
          placeholder="add something in the database"
          style={{ width: '200px' }}
        />
        <button onClick={this.onSubmit}>
          ADD
        </button>
      </div>
    );
  }
}

class Delete extends Component {
  onSubmit = () => {
    this.props.onSubmit(this.state.idToDelete);
  }
  render() {
    return (
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => this.setState({ idToDelete: e.target.value })}
          placeholder="put id of item to delete here"
        />
        <button onClick={this.onSubmit}>
          DELETE
        </button>
      </div>
    );
  }
}

class Update extends Component {
  onSubmit = () => {
    this.props.onSubmit(this.state.idToUpdate, this.state.updateToApply);
  }
  render() {
    return (
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => this.setState({ idToUpdate: e.target.value })}
          placeholder="id of item to update here"
        />
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => this.setState({ updateToApply: e.target.value })}
          placeholder="put new value of the item here"
        />
        <button onClick={this.onSubmit}>
          UPDATE
        </button>
      </div>
    );
  }
}

class ListItem extends Component {
  render() {
    return(
      <li style={{ padding: '10px' }} key={this.props.data.id}>
        <span style={{ color: 'gray' }}> id: </span> {this.props.data.id} <br />
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
      success : false,
      url : "",
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

  handleChange = (ev) => {
    this.setState({success: false, url : ""});
    
  }

  // Perform the upload
  handleUpload = (ev) => {
    const file = this.uploadInput.files[0];
    // Split the filename to get the name and type
    const fileParts = this.uploadInput.files[0].name.split('.');
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
      this.setState({url: url})
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
        this.setState({success: true});

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
    const SuccessMessage = () => (
      <div style={{padding:50}}>
        <h3 style={{color: 'green'}}>SUCCESSFUL UPLOAD</h3>
        <a href={this.state.url}>Access the file here</a>
        <br/>
      </div>
    )
    return (
      <div>
        <ul>
          {data.length === 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
              <ListItem data={dat} key={dat.id}/>
              ))}
        </ul>
        <Add onSubmit={this.putDataToDB}/>
        <Delete onSubmit={this.deleteFromDB}/>
        <Update onSubmit={this.updateDB}/>
        <center>
          <h1>UPLOAD A FILE</h1>
          {this.state.success ? <SuccessMessage/> : null}
          <input onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file"/>
          <br/>
          <button onClick={this.handleUpload}>UPLOAD</button>
        </center>
      </div>
    );
  }
}

export default App;