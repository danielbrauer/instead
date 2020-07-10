import React from 'react'
import { List, Message, Loader } from 'semantic-ui-react'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'
import { useQuery, useMutation } from 'react-query'
import { getFollowees, unfollow } from './RoutesAuthenticated'

export default function FolloweeList() {
    const following = useQuery('followees', getFollowees)
    const [unfollowMutation] = useMutation(unfollow)
    if (following.isError) return (
        <div>
            <Message negative>
                <Message.Header>Error fetching followers</Message.Header>
            </Message>
        </div>
    )
    if (following.isLoading) return (
        <div>
            <Loader active></Loader>
        </div>
    )
    return (
        <div>
            {following.data!.length === 0 ?
                <Message>You aren't following anyone yet</Message>
                :
                <List verticalAlign='middle'>
                    {following.data!.map(followee => (
                        <List.Item key={followee}>
                            <List.Content floated='right'>
                                <SafetyButton size='mini' onClick={() => unfollowMutation(followee)}>Unfollow</SafetyButton>
                            </List.Content>
                            <UserInList id={followee} />
                        </List.Item>
                    ))}
                </List>
            }
        </div>
    )
}