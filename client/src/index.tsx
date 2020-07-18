import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import AppAuthenticated from './AppAuthenticated'
import AppUnauthenticated from './AppUnauthenticated'
import AppWelcome from './AppWelcome'
import 'semantic-ui-css/semantic.min.css'
import { ReactQueryDevtools } from 'react-query-devtools'

const routing = (
    <BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
        <Switch>
            <Route exact path="/" component={AppUnauthenticated} />
            <Route path="/signup" component={AppUnauthenticated} />
            <Route path="/login" component={AppUnauthenticated} />

            <Route path="/home" component={AppAuthenticated} />
            <Route path="/user/:username" component={AppAuthenticated} />
            <Route path="/post/:postid" component={AppAuthenticated} />
            <Route path="/followers" component={AppAuthenticated} />
            <Route path="/following" component={AppAuthenticated} />
            <Route path="/requests" component={AppAuthenticated} />
            <Route path="/new" component={AppAuthenticated} />

            <Route path="/welcome" component={AppWelcome} />
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'))
