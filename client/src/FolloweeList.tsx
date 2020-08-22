import React from 'react'
import { List, Message, Loader, Label } from 'semantic-ui-react'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'
import { useQuery, useMutation } from 'react-query'
import { getFollowees, unfollow, getSentFollowRequests } from './routes/api'
import FollowUserForm from './Components/FollowUserForm'

export default function FolloweeList() {
    const sentRequests = useQuery('sentFollowRequests', getSentFollowRequests)
    const following = useQuery('followees', getFollowees)
    const [unfollowMutation] = useMutation(unfollow)

    if (following.isError || sentRequests.isError) return <Message negative content='Error fetching followees' />
    if (following.isLoading || sentRequests.isLoading) return <Loader active />
    return (
        <>
            <FollowUserForm />
            <List>
                {sentRequests.data!.map((request) => (
                    <List.Item key={request.requesteeId}>
                        <List.Content floated='right'>
                            <Label basic color='green' content='Requested' />
                        </List.Content>
                        <List.Content>
                            <Label size='large' content={request.friendCode} />
                        </List.Content>
                    </List.Item>
                ))}
            </List>
            <List>
                {following.data!.map((followee) => (
                    <List.Item key={followee}>
                        <List.Content floated='right'>
                            <SafetyButton icon='x' color='red' size='mini' onClick={() => unfollowMutation(followee)} />
                        </List.Content>
                        <List.Content>
                            <UserInList id={followee} />
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </>
    )
}
