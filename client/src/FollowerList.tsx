import React from 'react'
import { List, Message, Loader } from 'semantic-ui-react'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'
import { useQuery, useMutation } from 'react-query'
import { getFollowers, removeFollower } from './RoutesAuthenticated'

export default function FollowerList() {
    const followers = useQuery('followers', getFollowers)
    const [removeFollowerMutation] = useMutation(removeFollower)

    if (followers.isError) return <Message negative content='Error fetching followers' />
    if (followers.isLoading) return <Loader active />
    return (
        <div>
            {followers.data!.length === 0 ? (
                <Message>You don't have any followers yet</Message>
            ) : (
                <List verticalAlign='middle'>
                    {followers.data!.map((follower) => (
                        <List.Item key={follower}>
                            <SafetyButton floated='right' size='mini' onClick={() => removeFollowerMutation(follower)}>
                                Remove
                            </SafetyButton>
                            <UserInList id={follower} />
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
    )
}
