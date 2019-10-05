import React from 'react'
import { List, Message } from 'semantic-ui-react'
import { User } from './Interfaces'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'

export interface FollowingListProps {
    followees: number[],
    unfollow: (userid: number) => void,
    getUser: (userid: number) => User,
}

export default function FollowerList(props: FollowingListProps) {
    return (
        <div>
            {props.followees.length === 0 ?
                <Message>You aren't following anyone yet</Message>
                :
                <List verticalAlign='middle'>
                    {props.followees.map(followee => (
                        <List.Item key={followee}>
                            <List.Content floated='right'>
                                <SafetyButton size='mini' onClick={() => props.unfollow(followee)}>Unfollow</SafetyButton>
                            </List.Content>
                            <UserInList id={followee} getUser={props.getUser} />
                        </List.Item>
                    ))}
                </List>
            }
        </div>
    )
}