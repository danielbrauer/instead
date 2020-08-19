import React from 'react'
import FollowerList from './FollowerList'
import FolloweeList from './FolloweeList'
import { Menu, MenuItem } from 'semantic-ui-react'
import { Switch, Route, useHistory } from 'react-router'

export default function FollowerPage() {
    const history = useHistory()

    const PathMenuItem = (props: { name: string; path: string }) => {
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
            <Menu fluid pointing>
                <PathMenuItem name='Followers' path='/followers' />
                <PathMenuItem name='Following' path='/following' />
            </Menu>
            <Switch>
                <Route path='/followers'>
                    <FollowerList />
                </Route>
                <Route path='/following'>
                    <FolloweeList />
                </Route>
            </Switch>
        </div>
    )
}
