import React, { Component } from 'react'
import Axios from 'axios'
import AxiosHelper from './AxiosHelper'
import CurrentUser from './CurrentUser'
import { LinkedComponent } from 'valuelink'

class UserForm extends LinkedComponent {
    // initialize our state
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            passwordAgain: '',
        }
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
                {this.props.newUser
                    ? <input type="password" placeholder="repeat password" {...linked.passwordAgain.props} />
                    : null}
                <input type="submit" value="Submit" />
            </form>
        )
    }
}

class App extends Component {
    // initialize our state
    constructor(props) {
        super(props)
        this.state = {
            newUser: false,
        }
    }

    login = data => {
        console.log('logging in')
        Axios.get(this.props.serverUrl + 'login',
            {
                auth: {
                    username: data.username,
                    password: data.password,
                },
            })
            .then(res => {
                CurrentUser.setToken(res.data.token)
                this.props.setLoggedIn(true)
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    }

    createUser = data => {
        console.log('creating user')
        Axios.post(this.props.serverUrl + 'new',
            {
                username: data.username,
                password: data.password
            })
            .then(res => {
                CurrentUser.setToken(res.data.token)
                this.props.setLoggedIn(true)
            })
            .catch(error => {
                AxiosHelper.logError(error)
            })
    }

    switch = () => {
        this.setState({newUser: !this.state.newUser})
    }

    render() {
        let form
        if (this.state.newUser) {
            form = <UserForm newUser={true} onSubmit={this.createUser}/>
        } else {
            form = <UserForm newUser={false} onSubmit={this.login}/>
        }
        return (
            <div>
                {form}
                <button onClick={this.switch}>switch</button>
            </div>
        )
    }
}

export default App