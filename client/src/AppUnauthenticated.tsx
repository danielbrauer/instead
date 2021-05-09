import React from 'react'
import { ReactQueryConfigProvider } from 'react-query'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import LoginForm from './Components/LoginForm'
import SignupForm from './Components/SignupForm'
import CurrentUser from './CurrentUser'

const queryConfig = {
    mutations: {
        throwOnError: true,
    },
}

export default function AppUnauthenticated() {
    if (CurrentUser.loggedIn())
        return (<Redirect to='/home'/>)

    return (
        <ReactQueryConfigProvider config={queryConfig}>
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Switch>
                        <Route exact path="/"> <Redirect to="/login" /></Route>
                        <Route exact path="/signup"><SignupForm /></Route>
                        <Route exact path="/login"><LoginForm /></Route>
                    </Switch>
                </Grid.Column>
            </Grid>
        </ReactQueryConfigProvider>
    )
}