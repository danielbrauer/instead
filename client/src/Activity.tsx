import React from 'react'
import { useQuery } from 'react-query'
import { Feed, Message } from 'semantic-ui-react'
import InternalLink from './Components/InternalLink'
import dayjs from './relativeTime'
import { getActivity } from './routes/api'
import UserInList from './UserInList'
import PostThumbnail from './PostThumbnail'

export default function () {
    const activityQuery = useQuery(['activity'], getActivity)
    if (!activityQuery.isSuccess) return <Message content='loading' />
    return (
        <div className={'activity-feed'}>
            <Feed>
                {activityQuery.data!.map((item) => (
                    <Feed.Event key={item.postId.toString() + item.id.toString()}>
                        <Feed.Summary>
                            <UserInList id={item.authorId} /> commented on your post {' '}
                            <Feed.Date>{dayjs(item.published).fromNow()}</Feed.Date>
                        </Feed.Summary>
                        <InternalLink to={`/post/${item.postId}`}>
                            <PostThumbnail postId={item.postId} />
                        </InternalLink>
                    </Feed.Event>
                ))}
            </Feed>
        </div>
    )
}
