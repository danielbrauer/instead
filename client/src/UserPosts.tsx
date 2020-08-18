import React from 'react'
import { useInfiniteQuery } from 'react-query'
import { List, Message, Loader } from 'semantic-ui-react'
import EncryptedImage from './EncryptedImage'
import { getUserPosts } from './RoutesAuthenticated'
import PostHeader from './PostHeader'
import { useParams } from 'react-router-dom'
import InternalLink from './Components/InternalLink'
import InfiniteScroll from 'react-infinite-scroller'

export default function () {
    const { id: userId } = useParams()
    const posts = useInfiniteQuery(['posts', userId], getUserPosts, {
        getFetchMore: (lastGroup, allGroups) => lastGroup.length > 0 && lastGroup[lastGroup.length - 1].index,
    })

    if (posts.isError) return <Message negative content='Error fetching posts' />
    if (posts.isLoading) return <Loader active />
    return (
        <InfiniteScroll
            element={'List'}
            loadMore={() => posts.canFetchMore && posts.fetchMore()}
            hasMore={posts.canFetchMore}
            loader={<Loader />}
            initialLoad={false}
        >
            {posts.data!.map((group) =>
                group.map((post) => (
                    <List.Item key={post.id}>
                        <PostHeader post={post} />
                        <InternalLink to={`/post/${post.id.toString()}`}>
                            <EncryptedImage post={post} />
                        </InternalLink>
                    </List.Item>
                )),
            )}
        </InfiniteScroll>
    )
}
