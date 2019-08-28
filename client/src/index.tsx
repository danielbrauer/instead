import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import AppAuthenticated from './AppAuthenticated'
import AppUnauthenticated from './AppUnauthenticated'
import 'semantic-ui-css/semantic.min.css'

const routing = (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={AppUnauthenticated} />
            <Route path="/signup" component={AppUnauthenticated} />
            <Route path="/login" component={AppUnauthenticated} />

            <Route path="/home" component={AppAuthenticated} />
            <Route path="/user/:username" component={AppAuthenticated} />
            <Route path="/post/:postid" component={AppAuthenticated} />
            <Route path="/followers" component={AppAuthenticated} />
            <Route path="/new" component={AppAuthenticated} />
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'))
