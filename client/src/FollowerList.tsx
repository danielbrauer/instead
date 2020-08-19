import React from 'react'
import { List, Message, Loader, Button } from 'semantic-ui-react'
import SafetyButton from './SafetyButton'
import UserInList from './UserInList'
import { useQuery, useMutation } from 'react-query'
import {
    getFollowers,
    removeFollower,
    getFollowRequests,
    acceptFollowRequest,
    rejectFollowRequest,
} from './RoutesAuthenticated'

export default function FollowerList() {
    const requests = useQuery('followRequests', getFollowRequests)
    const [acceptMutation] = useMutation(acceptFollowRequest)
    const [rejectMutation] = useMutation(rejectFollowRequest)

    const followers = useQuery('followers', getFollowers)
    const [removeFollowerMutation] = useMutation(removeFollower)

    if (followers.isError) return <Message negative content='Error fetching followers' />
    if (followers.isLoading) return <Loader active />
    return (
        <>
            {requests.data!.length + followers.data!.length == 0 ? (
                <Message>You don't have any followers yet</Message>
            ) : null}
            <List>
                {requests.data!.map((requester) => (
                    <List.Item key={requester}>
                        <List.Content floated='right'>
                            <Button.Group size='mini'>
                                <Button positive onClick={() => acceptMutation(requester)}>
                                    Accept
                                </Button>
                                <Button negative onClick={() => rejectMutation(requester)}>
                                    Reject
                                </Button>
                            </Button.Group>
                        </List.Content>
                        <UserInList id={requester} />
                    </List.Item>
                ))}
                {followers.data!.map((follower) => (
                    <List.Item key={follower}>
                        <SafetyButton floated='right' size='mini' onClick={() => removeFollowerMutation(follower)}>
                            Remove
                        </SafetyButton>
                        <UserInList id={follower} />
                    </List.Item>
                ))}
            </List>
        </>
    )
}
