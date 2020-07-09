import React from 'react'
import { List, Button, Message, Loader } from 'semantic-ui-react'
import UserInList from './UserInList'
import { useQuery, useMutation } from 'react-query'
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from './RoutesAuthenticated'

export default function FollowerList() {
    const requests = useQuery('followRequests', getFollowRequests)
    const [acceptMutation] = useMutation(acceptFollowRequest)
    const [rejectMutation] = useMutation(rejectFollowRequest)
    if (requests.isError) return (
        <div>
            <Message negative>
                <Message.Header>Error fetching followers</Message.Header>
            </Message>
        </div>
    )
    if (requests.isLoading) return (
        <div>
            <Loader active></Loader>
        </div>
    )
    return (
        <div>
            {requests.data!.length === 0 ?
                <Message>You don't have any follow requests</Message>
                :
                <List verticalAlign='middle'>
                    {requests.data!.map((request) => (
                        <List.Item key={request.requester_id}>
                            <List.Content floated='right'>
                                <Button.Group size='mini'>
                                    <Button positive onClick={() => acceptMutation(request.requester_id)}>Accept</Button>
                                    <Button negative onClick={() => rejectMutation(request.requester_id)}>Reject</Button>
                                </Button.Group>
                            </List.Content>
                            <UserInList id={request.requester_id} />
                        </List.Item>
                    ))}
                </List>}
        </div>
    )
}