import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { InfiniteQueryResult } from 'react-query'
import { List, Loader, Message } from 'semantic-ui-react'
import { IGetHomePostsWithKeysResult } from '../../backend/src/queries/posts.gen'
import Comments from './Comments'
import InternalLink from './Components/InternalLink'
import EncryptedImage from './EncryptedImage'
import PostHeader from './PostHeader'

export default function Posts({ posts }: { posts: InfiniteQueryResult<IGetHomePostsWithKeysResult[], unknown> }) {
    if (posts.isError) return <Message negative content='Error fetching posts' />
    if (posts.isLoading) return <Loader active />
    return (
        <InfiniteScroll
            loadMore={() => posts.canFetchMore && posts.fetchMore()}
            hasMore={posts.canFetchMore}
            loader={<Loader key='0' />}
            initialLoad={false}
        >
            {posts
                .data!.map((group) =>
                    group.map((post) => (
                        <List.Item className='post' key={post.id}>
                            <div className='post-top'>
                                <PostHeader post={post} />
                            </div>
                            <InternalLink to={`/post/${post.id.toString()}`}>
                                <EncryptedImage post={post} />
                            </InternalLink>
                            <div className='post-bottom'>
                                <Comments postId={post.id} limit={3} compact />
                            </div>
                        </List.Item>
                    )),
                )
                .flat()}
        </InfiniteScroll>
    )
}
