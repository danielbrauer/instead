import React from 'react'
import FollowUserForm from './Components/FollowUserForm'
import { Button, List, Header } from 'semantic-ui-react'
import { FollowRequest, FollowUserCallback, User } from './Interfaces'

export interface FollowerPageProps {
    requests : FollowRequest[],
    followers : string[],
    follow: (username : string, callback : FollowUserCallback) => void,
    accept: (userid : string) => void,
    reject: (userid : string) => void,
    getUser: (userid : string) => User,
}

export default function FollowerPage(props : FollowerPageProps) {
    return (
        <div>
            <FollowUserForm callback={props.follow} />
            <List>
                {props.requests.map((request) => (
                    <List.Item key={request.requesterId}>
                        <Button onClick={() => props.accept(request.requesterId)}>accept</Button>
                        <Button onClick={() => props.reject(request.requesterId)}>reject</Button>
                        <List.Content>{props.getUser(request.requesterId).username}</List.Content>
                    </List.Item>
                ))}
            </List>
            <Header>Followers</Header>
            <List>
                {props.followers.map(follower => (
                    <List.Item key={follower}>
                        <List.Content>{props.getUser(follower).username}</List.Content>
                    </List.Item>
                ))}
            </List>
        </div>
    )
}