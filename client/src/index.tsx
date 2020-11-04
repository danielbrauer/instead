import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import AppAuthenticated from './AppAuthenticated'
import AppUnauthenticated from './AppUnauthenticated'
import AppWelcome from './AppWelcome'
import './index.css'

const routing = (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={AppUnauthenticated} />
            <Route path={['/signup', '/login']} component={AppUnauthenticated} />

            <Route
                path={['/home', '/user/:username', '/post/:postid', '/followers', '/following', '/requests', '/new']}
                component={AppAuthenticated}
            />

            <Route path='/welcome' component={AppWelcome} />
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'))
