import React, { Component, Suspense } from 'react'
import CurrentUser from './CurrentUser'

import { Loader, Dimmer } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const AppAuthenticated = React.lazy(() => import('./AppAuthenticated'))
const AppUnauthenticated = React.lazy(() => import('./AppUnauthenticated'))

const serverUrl = process.env.REACT_APP_BACKEND_URL

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: CurrentUser.loggedIn(),
        }
    }

    setLoggedIn = value => {
        this.setState({loggedIn: value})
    }

    render() {
        return (
            <div>
                <Suspense fallback={<Dimmer active inverted><Loader size='massive'/></Dimmer>}>
                {this.state.loggedIn
                    ? <AppAuthenticated setLoggedIn={this.setLoggedIn} serverUrl={serverUrl + "api/"}/>
                    : <AppUnauthenticated setLoggedIn={this.setLoggedIn} serverUrl={serverUrl + "auth/"}/>}
                </Suspense>
            </div>
        )
    }
}

export default App