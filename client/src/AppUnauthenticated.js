import React, { Component } from 'react'
import Axios from 'axios'
import User from './User'
import { LinkedComponent } from 'valuelink'

class UserForm extends LinkedComponent {
    // initialize our state
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
        };
    }

    handleSubmit = (event) => {
        this.props.onSubmit(this.state)
        event.preventDefault()
    }

    render() {
        const linked = this.linkAll()
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="username" {...linked.username.props} />
                <input type="password" placeholder="password" {...linked.password.props} />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class App extends Component {
    // initialize our state
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    login = data => {
        console.log('loge')
        Axios.post(this.props.serverUrl + 'login',
            {
                email: data.username,
                password: data.password
            })
            .then(res => {
                console.log(res)
                User.setToken(res.data.token)
                this.props.setLoggedIn(true)
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <UserForm onSubmit={this.login}/>
        );
    }
}

export default App