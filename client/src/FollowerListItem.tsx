import React from 'react'
import { List, Button, Icon, Label } from 'semantic-ui-react'
import SafetyButton from './SafetyButton'
import { useMutation, useQuery } from 'react-query'
import { rejectFollowRequest, removeFollower, getUser, sendFollowRequestDirect } from './routes/api'
import InternalLink from './Components/InternalLink'

export interface FollowerItemInfo {
    id: number
    type: 'request' | 'follower'
    justAccepted?: boolean
    following?: boolean
    requested?: boolean
}

export default function ({ item, onAccept }: { item: FollowerItemInfo; onAccept: (x: number) => void }) {
    const [rejectMutation] = useMutation(rejectFollowRequest)
    const [removeFollowerMutation] = useMutation(removeFollower)
    const [sendRequestMutation] = useMutation(sendFollowRequestDirect)
    const user = useQuery(['user', item.id], getUser, { staleTime: Infinity })

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
                <Icon size='big' name='user' />
                <InternalLink to={`/user/${item.id.toString()}`}>
                    {user.data ? user.data!.displayName || user.data!.id.toString() : 'loading'}
                </InternalLink>
            </List.Content>
        </List.Item>
    )
}
