import React, { useEffect } from 'react'
import CurrentUser from './CurrentUser'
import FollowerPage from './FollowerPage'
import Posts from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'

import { Menu, Dropdown } from 'semantic-ui-react'
import { queryCache } from 'react-query'
import { logout } from './RoutesAuthenticated'
import SinglePost from './SinglePost'
import UserPosts from './UserPosts'

export default function() {
    const history = useHistory()

    const logOutAndClear = async () => {
        try {
            await logout()
        } finally {
            queryCache.clear()
            CurrentUser.clear()
            history.push('/login')
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
                            <Dropdown.Item icon='list' text='Home' onClick={() => history.push('/home')}/>
                            <Dropdown.Item icon='image' text='New Post' onClick={() => history.push('/new')}/>
                            <Dropdown.Item icon='user' text='Followers' onClick={() => history.push('/followers')}/>
                            <Dropdown.Divider />
                            <Dropdown.Item icon='sign-out' text='Log Out' onClick={logOutAndClear}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu>
            <br />
            <br />
            <Switch>
                <Route path='/followers'><FollowerPage /></Route>
                <Route path='/following'><FollowerPage /></Route>
                <Route path='/requests'><FollowerPage /></Route>
                <Route path='/home'><Posts /></Route>
                <Route path='/new'><NewPost /></Route>
                <Route path='/post/:id'><SinglePost /></Route>
                <Route path='/user/:id'><UserPosts /></Route>
            </Switch>
        </div>
    )
}