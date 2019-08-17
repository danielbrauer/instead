import React from 'react'
import FollowUserForm from './Components/FollowUserForm'
import { Button, List, Header } from 'semantic-ui-react'

export default function FollowerPage(props) {
    return (
        <div>
            <FollowUserForm callback={props.callbacks.follow} />
            <List>
                {props.requests.map((request) => (
                    <List.Item key={request.requesterId}>
                        <Button onClick={() => props.callbacks.accept(request.requesterId)}>accept</Button>
                        <Button onClick={() => props.callbacks.reject(request.requesterId)}>reject</Button>
                        <List.Content>{props.callbacks.getUser(request.requesterId).username}</List.Content>
                    </List.Item>
                ))}
            </List>
            <Header>Followers</Header>
            <List>
                {props.followers.map(follower => (
                    <List.Item key={follower}>
                        <List.Content>{props.callbacks.getUser(follower).username}</List.Content>
                    </List.Item>
                ))}
            </List>
        </div>
    )
}