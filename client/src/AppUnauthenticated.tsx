import React from 'react'
import CurrentUser from './CurrentUser'
import LoginForm from './Components/LoginForm'
import SignupForm from './Components/SignupForm'
import { Grid } from 'semantic-ui-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ReactQueryConfigProvider } from 'react-query'

const queryConfig = {
    mutations: {
        throwOnError: true,
    },
}

export default function() {
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