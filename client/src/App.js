import React, { Component } from 'react';
import User from './User'

import 'semantic-ui-css/semantic.min.css'

// const AppAuthenticated = React.lazy(() => import('./AppAuthenticated'))
// const AppUnauthenticated = React.lazy(() => import('./AppUnauthenticated'))
import AppAuthenticated from './AppAuthenticated'
import AppUnauthenticated from './AppUnauthenticated'

const serverUrl = "http://localhost:3001/"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: User.loggedIn(),
        }
    }

    setLoggedIn = value => {
        this.setState({loggedIn: value})
    }

    render() {
        return (
            <div>
                {this.state.loggedIn
                    ? <AppAuthenticated setLoggedIn={this.setLoggedIn} serverUrl={serverUrl + "api/"}/>
                    : <AppUnauthenticated setLoggedIn={this.setLoggedIn} serverUrl={serverUrl + "auth/"}/>}
            </div>
        )
    }
}

export default App