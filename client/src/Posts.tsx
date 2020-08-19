import React from 'react'
import { InfiniteQueryResult } from 'react-query'
import { List, Message, Loader } from 'semantic-ui-react'
import EncryptedImage from './EncryptedImage'
import PostHeader from './PostHeader'
import InternalLink from './Components/InternalLink'
import InfiniteScroll from 'react-infinite-scroller'
import { IGetHomePostsWithKeysResult } from '../../backend/src/queries/posts.gen'

export default function ({ posts }: { posts: InfiniteQueryResult<IGetHomePostsWithKeysResult[], unknown> }) {
    if (posts.isError) return <Message negative content='Error fetching posts' />
    if (posts.isLoading) return <Loader active />
    return (
        <InfiniteScroll
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
