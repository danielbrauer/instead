import React from 'react'
import { List, Message, Loader } from 'semantic-ui-react'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'
import { useQuery, useMutation } from 'react-query'
import { getFollowers, removeFollower } from './RoutesAuthenticated'

export default function FollowerList() {
    const followers = useQuery('followers', getFollowers)
    const [removeFollowerMutation] = useMutation(removeFollower)
    if (followers.isError) return (
        <div>
            <Message negative>
                <Message.Header>Error fetching followers</Message.Header>
            </Message>
        </div>
    )
    if (followers.isLoading) return (
        <div>
            <Loader active></Loader>
        </div>
    )
    return (
        <div>
            {followers.data!.length === 0 ?
                <Message>You don't have any followers yet</Message>
                :
                <List verticalAlign='middle'>
                    {followers.data!.map(follower => (
                        <List.Item key={follower}>
                            <List.Content floated='right'>
                                <SafetyButton size='mini' onClick={() => removeFollowerMutation(follower)}>Remove</SafetyButton>
                            </List.Content>
                            <UserInList id={follower} />
                        </List.Item>
                    ))}
                </List>
            }
        </div>
    )
}