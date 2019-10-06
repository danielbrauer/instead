import React from 'react'
import { List, Message } from 'semantic-ui-react'
import { User } from './Interfaces'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'

export interface FollowerListProps {
    followers: number[],
    removeFollower: (userid: number) => void,
    getUser: (userid: number) => User,
}

export default function FollowerList(props: FollowerListProps) {
    return (
        <div>
            {props.followers.length === 0 ?
                <Message>You don't have any followers yet</Message>
                :
                <List verticalAlign='middle'>
                    {props.followers.map(follower => (
                        <List.Item key={follower}>
                            <List.Content floated='right'>
                                <SafetyButton size='mini' onClick={() => props.removeFollower(follower)}>Remove</SafetyButton>
                            </List.Content>
                            <UserInList id={follower} getUser={props.getUser} />
                        </List.Item>
                    ))}
                </List>
            }
        </div>
    )
}