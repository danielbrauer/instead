import React from 'react'
import { Route, Switch, useHistory } from 'react-router'
import { Menu, MenuItem, Segment } from 'semantic-ui-react'
import FolloweeList from './FolloweeList'
import FollowerList from './FollowerList'

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
        <>
            <Menu widths={2} tabular>
                <PathMenuItem name='Followers' path='/followers' />
                <PathMenuItem name='Following' path='/following' />
            </Menu>
            <Segment vertical>
                <Switch>
                    <Route path='/followers'>
                        <FollowerList />
                    </Route>
                    <Route path='/following'>
                        <FolloweeList />
                    </Route>
                </Switch>
            </Segment>
        </>
    )
}
