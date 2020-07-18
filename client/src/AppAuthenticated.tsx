import React, { useEffect } from 'react'
import CurrentUser from './CurrentUser'
import FollowerPage from './FollowerPage'
import Posts from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'

import { Menu, Dropdown } from 'semantic-ui-react'
import { queryCache } from 'react-query'
import { logout } from './RoutesAuthenticated'

export default function(props: RouteComponentProps<any>) {

    const logOutAndClear = async () => {
        try {
            await logout()
        } finally {
            queryCache.clear()
            CurrentUser.clear()
            props.history.push('/login')
        }
    }

    useEffect(() => {
        if (!CurrentUser.loggedIn())
            logOutAndClear()
    })

    if (!CurrentUser.loggedIn()) {
        return (<Redirect to='/login' />)
    }

    return (
        <div>
            <Menu inverted fixed='top' size='small'>
                <Menu.Item header>
                    Instead
                </Menu.Item>
                <Menu.Item fitted position='right'>
                    <Dropdown item direction='left' text={CurrentUser.getUsername()}>
                        <Dropdown.Menu>
                            <Dropdown.Item icon='list' text='Home' onClick={() => props.history.push('/home')}/>
                            <Dropdown.Item icon='image' text='New Post' onClick={() => props.history.push('/new')}/>
                            <Dropdown.Item icon='user' text='Followers' onClick={() => props.history.push('/followers')}/>
                            <Dropdown.Divider />
                            <Dropdown.Item icon='sign-out' text='Log Out' onClick={logOutAndClear}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu>
            <br />
            <br />
            <Switch>
                <Route path='/followers' render={props => <FollowerPage {...props}/>} />
                <Route path='/following' render={props => <FollowerPage {...props} />} />
                <Route path='/requests' render={props => <FollowerPage {...props} />} />
                <Route path='/home'><Posts /></Route>
                <Route path='/new' render={props => <NewPost {...props} />} />
            </Switch>
        </div>
    )
}