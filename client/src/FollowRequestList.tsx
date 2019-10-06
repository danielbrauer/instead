import React from 'react'
import { List, Button, Message } from 'semantic-ui-react'
import { User, FollowRequest } from './Interfaces'
import UserInList from './UserInList'

export interface FollowRequestListProps {
    requests: FollowRequest[],
    accept: (userid: number) => void,
    reject: (userid: number) => void,
    getUser: (userid: number) => User,
}

export default function FollowerList(props: FollowRequestListProps) {
    return (
        <div>
            {props.requests.length === 0 ?
                <Message>You don't have any follow requests</Message>
                :
                <List verticalAlign='middle'>
                    {props.requests.map((request) => (
                        <List.Item key={request.requester_id}>
                            <List.Content floated='right'>
                                <Button.Group size='mini'>
                                    <Button positive onClick={() => props.accept(request.requester_id)}>Accept</Button>
                                    <Button negative onClick={() => props.reject(request.requester_id)}>Reject</Button>
                                </Button.Group>
                            </List.Content>
                            <UserInList id={request.requester_id} getUser={props.getUser} />
                        </List.Item>
                    ))}
                </List>}
        </div>
    )
}