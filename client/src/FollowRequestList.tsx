import React from 'react'
import { List, Button, Message, Loader } from 'semantic-ui-react'
import UserInList from './UserInList'
import { useQuery, useMutation } from 'react-query'
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from './RoutesAuthenticated'

export default function FollowerList() {
    const requests = useQuery('followRequests', getFollowRequests)
    const [acceptMutation] = useMutation(acceptFollowRequest)
    const [rejectMutation] = useMutation(rejectFollowRequest)

    if (requests.isError) return <Message negative content='Error fetching followers' />
    if (requests.isLoading) return <Loader active />
    return (
        <div>
            {requests.data!.length === 0 ? (
                <Message>You don't have any follow requests</Message>
            ) : (
                <List verticalAlign='middle'>
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
                </List>
            )}
        </div>
    )
}
