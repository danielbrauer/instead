import React from 'react'
import FollowUserForm from './Components/FollowUserForm'
import { Button, List, Header } from 'semantic-ui-react'
import { FollowRequest, User } from './Interfaces'

export interface FollowerPageProps {
    requests : FollowRequest[],
    followers : number[],
    follow: (username : string) => Promise<any>,
    accept: (userid : number) => void,
    reject: (userid : number) => void,
    getUser: (userid : number) => User,
}

export default function FollowerPage(props : FollowerPageProps) {
    return (
        <div>
            <FollowUserForm callback={props.follow} />
            <List>
                {props.requests.map((request) => (
                    <List.Item key={request.requester_id}>
                        <Button onClick={() => props.accept(request.requester_id)}>accept</Button>
                        <Button onClick={() => props.reject(request.requester_id)}>reject</Button>
                        <List.Content>{props.getUser(request.requester_id).username}</List.Content>
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