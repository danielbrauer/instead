import React from 'react'
import CurrentUser from './CurrentUser'
import FollowerPage from './FollowerPage'
import Posts from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'

import { Menu, Dropdown } from 'semantic-ui-react'
import { queryCache, useQuery } from 'react-query'
import { logOut, getUser } from './RoutesAuthenticated'

export default function(props: RouteComponentProps<any>) {
    if (!CurrentUser.loggedIn())
        return (<Redirect to='/login' />)

    const currentUserName = useQuery(['user', CurrentUser.getId()], getUser)

    const logOutAndClear = async () => {
        try {
            await logOut()
        } finally {
            queryCache.clear()
            CurrentUser.clear()
            props.history.push('/login')
        }
    }
    return (
        <div>
            <Menu inverted fixed='top' size='small'>
                <Menu.Item header>
                    Instead
                </Menu.Item>
                <Menu.Item fitted position='right'>
                    <Dropdown item direction='left' text={currentUserName.isSuccess ? currentUserName.data.username : 'loading...'}>
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