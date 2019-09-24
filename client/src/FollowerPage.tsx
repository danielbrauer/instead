import React from 'react'
import FollowUserForm from './Components/FollowUserForm'
import { Button, List, Header, Icon } from 'semantic-ui-react'
import { FollowRequest, User } from './Interfaces'
import SafetyButton from './SafetyButton'

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

export default function FollowerPage(props: FollowerPageProps) {
    return (
        <div>
            <FollowUserForm callback={props.follow} />
            <Header>Requests</Header>
            <List verticalAlign='middle'>
                {props.requests.map((request) => (
                    <List.Item key={request.requester_id}>
                        <List.Content floated='right'>
                            <Button.Group size='mini'>
                                <Button color='green' onClick={() => props.accept(request.requester_id)}>Accept</Button>
                                <Button color='red' onClick={() => props.reject(request.requester_id)}>Reject</Button>
                            </Button.Group>
                        </List.Content>
                        <List.Content>
                            <Icon size='big' name='user'/>
                            {props.getUser(request.requester_id).username}
                        </List.Content>
                    </List.Item>
                ))}
            </List>
            <Header>Followers</Header>
            <List verticalAlign='middle'>
                {props.followers.map(follower => (
                    <List.Item key={follower}>
                        <List.Content floated='right'>
                            <SafetyButton size='mini' onClick={() => props.removeFollower(follower)}>Remove</SafetyButton>
                        </List.Content>
                        <List.Content>
                            <Icon size='big' name='user'/>
                            {props.getUser(follower).username}
                        </List.Content>
                    </List.Item>
                ))}
            </List>
            <Header>Following</Header>
            <List verticalAlign='middle'>
                {props.followees.map(followee => (
                    <List.Item key={followee}>
                        <List.Content floated='right'>
                            <SafetyButton size='mini' onClick={() => props.unfollow(followee)}>Unfollow</SafetyButton>
                        </List.Content>
                        <List.Content>
                            <Icon size='big' name='user'/>
                            {props.getUser(followee).username}
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </div>
    )
}