import React from 'react'
import FollowUserForm from './Components/FollowUserForm'
import FollowerList, { FollowerListProps } from './FollowerList'
import FollowingList, { FollowingListProps } from './FollowingList'
import FollowRequestList, { FollowRequestListProps } from './FollowRequestList'
import { Menu, MenuItem } from 'semantic-ui-react'
import { FollowRequest, User } from './Interfaces'
import { Switch, Route, RouteComponentProps } from 'react-router'

export interface FollowerPageProps {
    requests: FollowRequest[],
    followers: number[],
    followees: number[],
    follow: (username: string) => Promise<any>,
    accept: (userid: number) => void,
    reject: (userid: number) => void,
    unfollow: (userid: number) => void,
    removeFollower: (userid: number) => void,
    getUser: (userid: number) => User,
}

export default function FollowerPage(props: FollowerPageProps & RouteComponentProps<any>) {
    const followListProps: FollowerListProps = {
        followers: props.followers,
        removeFollower: props.removeFollower,
        getUser: props.getUser,
    }
    const followingListProps: FollowingListProps = {
        followees: props.followees,
        unfollow: props.unfollow,
        getUser: props.getUser,
    }
    const requestListProps: FollowRequestListProps = {
        requests: props.requests,
        accept: props.accept,
        reject: props.reject,
        getUser: props.getUser,
    }

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
            <FollowUserForm callback={props.follow} />
            {props.followers.length + props.followers.length + props.requests.length === 0 ?
                null
                :
                <div>
                    <Menu fluid pointing>
                        <PathMenuItem name='Followers' path='/followers' {...props} />
                        <PathMenuItem name='Following' path='/following' {...props} />
                        <PathMenuItem name='Requests' path='/requests' {...props} />
                    </Menu>
                    <Switch>
                        <Route path='/followers' render={props => <FollowerList {...props} {...followListProps} />} />
                        <Route path='/following' render={props => <FollowingList {...props} {...followingListProps} />} />
                        <Route path='/requests' render={props => <FollowRequestList {...props} {...requestListProps} />} />
                    </Switch>
                </div>
            }
        </div>
    )
}