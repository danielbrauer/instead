import React from 'react'
import FollowUserForm from './Components/FollowUserForm'
import FollowerList from './FollowerList'
import FolloweeList from './FolloweeList'
import FollowRequestList from './FollowRequestList'
import { Menu, MenuItem } from 'semantic-ui-react'
import { Switch, Route, useHistory } from 'react-router'

export default function FollowerPage() {
    const history = useHistory()

    const PathMenuItem = (props: { name: string, path: string } ) => {
        return (
            <MenuItem
                name={props.name}
                active={history.location.pathname === props.path}
                onClick={() => history.push(props.path)}
            />
        )
    }

    return (
        <div>
            <FollowUserForm />
            <Menu fluid pointing>
                <PathMenuItem name='Followers' path='/followers' />
                <PathMenuItem name='Following' path='/following' />
                <PathMenuItem name='Requests' path='/requests' />
            </Menu>
            <Switch>
                <Route path='/followers'> <FollowerList /></Route>
                <Route path='/following'> <FolloweeList /></Route>
                <Route path='/requests'> <FollowRequestList /></Route>
            </Switch>
        </div>
    )
}