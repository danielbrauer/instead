import React from 'react'
import FollowUserForm from './Components/FollowUserForm'
import FollowerList from './FollowerList'
import FolloweeList from './FolloweeList'
import FollowRequestList from './FollowRequestList'
import { Menu, MenuItem } from 'semantic-ui-react'
import { Switch, Route, RouteComponentProps } from 'react-router'

export default function FollowerPage(props: RouteComponentProps<any>) {

    const PathMenuItem = (props: { name: string, path: string } & RouteComponentProps<any>) => {
        return (
            <MenuItem
                name={props.name}
                active={props.history.location.pathname === props.path}
                onClick={() => props.history.push(props.path)}
            />
        )
    }

    return (
        <div>
            <FollowUserForm />
            <Menu fluid pointing>
                <PathMenuItem name='Followers' path='/followers' {...props} />
                <PathMenuItem name='Following' path='/following' {...props} />
                <PathMenuItem name='Requests' path='/requests' {...props} />
            </Menu>
            <Switch>
                <Route path='/followers' render={props => <FollowerList />} />
                <Route path='/following' render={props => <FolloweeList />} />
                <Route path='/requests' render={props => <FollowRequestList />} />
            </Switch>
        </div>
    )
}