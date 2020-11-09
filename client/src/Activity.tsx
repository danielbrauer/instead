import React from 'react'
import { useQuery } from 'react-query'
import { Feed, Message } from 'semantic-ui-react'
import InternalLink from './Components/InternalLink'
import dayjs from './relativeTime'
import { getActivity } from './routes/api'
import UserInList from './UserInList'

export default function () {
    const activityQuery = useQuery(['activity'], getActivity)
    if (!activityQuery.isSuccess) return <Message content='loading' />
    return (
        <div>
            <Feed>
                {activityQuery.data!.map((item) => (
                    <Feed.Event key={item.postId.toString() + item.id.toString()}>
                        <Feed.Summary>
                            <UserInList id={item.authorId} /> commented on{' '}
                            <InternalLink to={`/post/${item.postId}`}>{item.postId.toString()}</InternalLink>
                            <Feed.Date>{dayjs(item.published).fromNow()}</Feed.Date>
                        </Feed.Summary>
                    </Feed.Event>
                ))}
            </Feed>
        </div>
    )
}
