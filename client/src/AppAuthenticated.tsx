import React, { Component } from 'react'
import CurrentUser from './CurrentUser'
import FollowerPage from './FollowerPage'
import Posts from './Posts'
import NewPost from './NewPost'
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'

import { Menu, Dropdown } from 'semantic-ui-react'
import { queryCache } from 'react-query'
import { logOut } from './RoutesAuthenticated'

class App extends Component<RouteComponentProps<any>> {

    logOutAndClear = async () => {
        try {
            await logOut()
        } finally {
            queryCache.clear()
            CurrentUser.clear()
            this.props.history.push('/login')
        }
    }

    render() {
        if (!CurrentUser.loggedIn())
            return (<Redirect to='/login' />)
        // const currentUser = useQuery(['user', CurrentUser.getId()], Routes.getUser)
        return (
            <div>
                <Menu inverted fixed='top' size='small'>
                    <Menu.Item header>
                        Instead
                    </Menu.Item>
                    <Menu.Item fitted position='right'>
                        <Dropdown item direction='left' text='{currentUser.data?.username}'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='list' text='Home' onClick={() => this.props.history.push('/home')}/>
                                <Dropdown.Item icon='image' text='New Post' onClick={() => this.props.history.push('/new')}/>
                                <Dropdown.Item icon='user' text='Followers' onClick={() => this.props.history.push('/followers')}/>
                                <Dropdown.Divider />
                                <Dropdown.Item icon='sign-out' text='Log Out' onClick={this.logOutAndClear}/>
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
}

export default App