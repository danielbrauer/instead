import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { List, Loader, Message } from 'semantic-ui-react'
import FriendCodeDisplay from './Components/FriendCodeDisplay'
import FollowerListItem, { FollowerItemInfo } from './FollowerListItem'
import { acceptFollowRequest, getFollowees, getFollowers, getFollowRequests, getSentFollowRequests } from './routes/api'

export default function FollowerList() {
    const requests = useQuery('followRequests', getFollowRequests)
    const sentRequests = useQuery('sentFollowRequests', getSentFollowRequests)
    const [acceptMutation] = useMutation(acceptFollowRequest)

    const followers = useQuery('followers', getFollowers)

    const following = useQuery('followees', getFollowees)

    const [accepted, setAccepted] = useState<number[]>([])

    const onAccept = (requesterId: number) => {
        acceptMutation(requesterId)
        setAccepted([requesterId, ...accepted])
    }

    if (followers.isError || requests.isError || following.isError || sentRequests.isError)
        return <Message negative content='Error fetching followers' />
    if (followers.isLoading || requests.isLoading || following.isLoading || sentRequests.isLoading)
        return <Loader active />

    const listItems: FollowerItemInfo[] = requests
        .data!.map(
            (id): FollowerItemInfo => {
                return {
                    id,
                    type: 'request',
                }
            },
        )
        .concat(
            followers.data!.map(
                (id): FollowerItemInfo => {
                    return {
                        id,
                        type: 'follower',
                        justAccepted: accepted.includes(id),
                        following: following.data!.includes(id),
                        requested: sentRequests.data!.some((x) => x.requesteeId === id),
                    }
                },
            ),
        )
        .sort((a, b) => {
            const aFirst = a.type === 'request' || a.justAccepted === true
            const bFirst = b.type === 'request' || b.justAccepted === true
            if (aFirst === bFirst) return a.id - b.id
            else return aFirst ? -1 : 1
        })

    return (
        <>
            <FriendCodeDisplay />
            {requests.data!.length + followers.data!.length === 0 ? (
                <Message>You don&apos;t have any followers yet</Message>
            ) : null}
            <List>
                {listItems.map((item) => (
                    <FollowerListItem key={item.id} item={item} onAccept={onAccept} />
                ))}
            </List>
        </>
    )
}
