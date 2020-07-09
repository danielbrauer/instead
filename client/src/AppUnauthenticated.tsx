import React from 'react'
import CurrentUser from './CurrentUser'
import LoginForm from './Components/LoginForm'
import NewUserForm from './Components/NewUserForm'
import { Grid } from 'semantic-ui-react'
import { Route, Switch, Redirect } from 'react-router-dom'

export default function() {
    if (CurrentUser.loggedIn())
        return (<Redirect to='/home'/>)

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Switch>
                    <Route exact path="/" render={props => <Redirect {...props} to="/login" />} />
                    <Route exact path="/signup" render={props => <NewUserForm {...props} />} />
                    <Route exact path="/login" render={props => <LoginForm {...props} />} />
                </Switch>
            </Grid.Column>
        </Grid>
    )
}