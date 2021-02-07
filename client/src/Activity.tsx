import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useInfiniteQuery } from 'react-query'
import { Feed, Loader, Message } from 'semantic-ui-react'
import InternalLink from './Components/InternalLink'
import PostThumbnail from './PostThumbnail'
import dayjs from './relativeTime'
import { getActivity, setActivityLastCheckedDate } from './routes/api'
import UserInList from './UserInList'

export default function () {
    const activityQuery = useInfiniteQuery('activity', getActivity, {
        getFetchMore: (lastGroup, allGroups) => lastGroup.length > 0 && lastGroup[lastGroup.length - 1].index,
        staleTime: 30,
        refetchOnWindowFocus: 'always',
    })
    useEffect(() => {
        return () => {
            setActivityLastCheckedDate()
        }
    }, [])
    if (!activityQuery.isSuccess) return <Message content='loading' />
    if (!activityQuery.data) return <Message>
        <Message.Header content={'No activity'} />
        <Message.Item content={'Comments on your posts will appear here'} />
    </Message>
    return (
        <div className={'activity-feed'}>
            <Feed>
        <InfiniteScroll
            loadMore={() => activityQuery.canFetchMore && activityQuery.fetchMore()}
            hasMore={activityQuery.canFetchMore}
            loader={<Loader key='0' />}
            initialLoad={false}
        >
                {activityQuery.data!.map((group) =>
                    group.map((item) => (
                    <Feed.Event key={item.postId.toString() + item.id.toString()}>
                        <Feed.Summary>
                            <UserInList id={item.authorId} /> commented on your post {' '}
                            <Feed.Date>{dayjs(item.published).fromNow()}</Feed.Date>
                        </Feed.Summary>
                        <InternalLink to={`/post/${item.postId}`}>
                            <PostThumbnail postId={item.postId} />
                        </InternalLink>
                    </Feed.Event>
                )),
                    )
                    .flat()}
        </InfiniteScroll>
            </Feed>
        </div>
    )
}
