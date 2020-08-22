import React, { useEffect } from 'react'
import CurrentUser from './CurrentUser'
import FollowerPage from './FollowerPage'
import HomePosts from './HomePosts'
import NewPost from './NewPost'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { Menu, Dropdown, Label, Icon } from 'semantic-ui-react'
import { queryCache, useQuery } from 'react-query'
import { logout, getFollowRequests, getUser } from './routes/api'
import SinglePost from './SinglePost'
import UserPosts from './UserPosts'

export default function () {
    const history = useHistory()
    const requests = useQuery('followRequests', getFollowRequests)
    const currentUserQuery = useQuery(['user', CurrentUser.getId()], getUser)

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
        if (!CurrentUser.loggedIn()) logOutAndClear()
    })

    if (!CurrentUser.loggedIn()) return <Redirect to='/login' />

    return (
        <div>
            <Menu inverted fixed='top' size='small'>
                <Menu.Item header onClick={() => history.location.pathname !== '/home' && history.push('/home')}>
                    Instead
                </Menu.Item>
                <Menu.Item onClick={() => history.push('/new')}>
                    <Icon fitted name='camera' />
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item onClick={() => history.push('/followers')}>
                        <Icon fitted name='user' />
                        {requests.isSuccess && requests.data!.length > 0 ? (
                            <Label color='red' size='medium' empty circular corner />
                        ) : null}
                    </Menu.Item>
                    <Dropdown
                        item
                        direction='left'
                        text={
                            currentUserQuery.isSuccess
                                ? currentUserQuery.data!.displayName || currentUserQuery.data!.id.toString()
                                : 'loading...'
                        }
                    >
                        <Dropdown.Menu>
                            <Dropdown.Item
                                icon='user'
                                text='Profile'
                                onClick={() => history.push(`/user/${CurrentUser.getId()}`)}
                            />
                            <Dropdown.Divider />
                            <Dropdown.Item icon='sign-out' text='Log Out' onClick={logOutAndClear} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
            <br />
            <br />
            <Switch>
                <Route path={['/followers', '/following']} component={FollowerPage} />
                <Route path='/home' component={HomePosts} />
                <Route path='/new' component={NewPost} />
                <Route path='/post/:id' component={SinglePost} />
                <Route path='/user/:id' component={UserPosts} />
            </Switch>
        </div>
    )
}
