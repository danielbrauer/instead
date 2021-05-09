import React from 'react'
import { useMutation } from 'react-query'
import { Button, Label, List } from 'semantic-ui-react'
import { rejectFollowRequest, removeFollower, sendFollowRequestDirect } from './routes/api'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'

export interface FollowerItemInfo {
    id: number
    type: 'request' | 'follower'
    justAccepted?: boolean
    following?: boolean
    requested?: boolean
}

export default function FollowerListItem({ item, onAccept }: { item: FollowerItemInfo; onAccept: (x: number) => void }) {
    const [rejectMutation] = useMutation(rejectFollowRequest)
    const [removeFollowerMutation] = useMutation(removeFollower)
    const [sendRequestMutation] = useMutation(sendFollowRequestDirect)

    return (
        <List.Item>
            <List.Content floated='right'>
                {item.type === 'request' ? (
                    <Button.Group size='mini'>
                        <Button positive onClick={() => onAccept(item.id)}>
                            Accept
                        </Button>
                        <Button negative onClick={() => rejectMutation(item.id)}>
                            Reject
                        </Button>
                    </Button.Group>
                ) : (
                    <>
                        {item.following ? (
                            <Label basic color='blue' content='Following' />
                        ) : item.requested ? (
                            <Label basic color='green' content='Requested' />
                        ) : (
                            <Button size='mini' content='Follow' onClick={() => sendRequestMutation(item.id)} />
                        )}
                        <SafetyButton
                            icon='x'
                            color='red'
                            size='mini'
                            onClick={() => removeFollowerMutation(item.id)}
                        />
                    </>
                )}
            </List.Content>
            <List.Content>
                <UserInList id={item.id} />
            </List.Content>
        </List.Item>
    )
}
