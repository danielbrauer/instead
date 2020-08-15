import React from 'react'
import { List, Message, Loader } from 'semantic-ui-react'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'
import { useQuery, useMutation } from 'react-query'
import { getFollowees, unfollow } from './RoutesAuthenticated'

export default function FolloweeList() {
    const following = useQuery('followees', getFollowees)
    const [unfollowMutation] = useMutation(unfollow)

    if (following.isError) return <Message negative content='Error fetching followees' />
    if (following.isLoading) return <Loader active />
    return (
        <div>
            {following.data!.length === 0 ? (
                <Message>You aren't following anyone yet</Message>
            ) : (
                <List verticalAlign='middle'>
                    {following.data!.map((followee) => (
                        <List.Item key={followee}>
                            <SafetyButton floated='right' size='mini' onClick={() => unfollowMutation(followee)}>
                                Unfollow
                            </SafetyButton>
                            <UserInList id={followee} />
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
    )
}
