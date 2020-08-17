import React from 'react'
import { useInfiniteQuery } from 'react-query'
import { List, Message, Loader } from 'semantic-ui-react'
import EncryptedImage from './EncryptedImage'
import { getHomePosts } from './RoutesAuthenticated'
import PostHeader from './PostHeader'
import InternalLink from './Components/InternalLink'
import InfiniteScroll from 'react-infinite-scroller'

export default function () {
    const posts = useInfiniteQuery('posts', getHomePosts, {
        getFetchMore: (lastGroup, allGroups) =>
            lastGroup.length ? lastGroup[lastGroup.length - 1].publishOrder : false,
    })

    if (posts.isError) return <Message negative content='Error fetching posts' />
    if (posts.isLoading) return <Loader active />
    return (
        <InfiniteScroll loadMore={() => posts.fetchMore()} hasMore={posts.canFetchMore} loader={<Loader />}>
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
