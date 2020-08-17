import React from 'react'
import { useInfiniteQuery } from 'react-query'
import { List, Message, Loader, Button } from 'semantic-ui-react'
import EncryptedImage from './EncryptedImage'
import { getHomePosts } from './RoutesAuthenticated'
import PostHeader from './PostHeader'
import InternalLink from './Components/InternalLink'

export default function () {
    const posts = useInfiniteQuery('posts', getHomePosts, {
        getFetchMore: (lastGroup, allGroups) => lastGroup.nextCursor,
    })

    if (posts.isError) return <Message negative content='Error fetching posts' />
    if (posts.isLoading) return <Loader active />
    return (
        <div>
            {posts.data!.length === 0 ? (
                <Message>To post a photo or follow people, use the menu ➚</Message>
            ) : (
                <>
                    <List>
                        {posts.data!.map((group) =>
                            group.data.map((post) => (
                                <List.Item key={post.id}>
                                    <PostHeader post={post} />
                                    <InternalLink to={`/post/${post.id.toString()}`}>
                                        <EncryptedImage post={post} />
                                    </InternalLink>
                                </List.Item>
                            )),
                        )}
                    </List>
                    <Button onClick={() => posts.fetchMore()} content='Load more' />
                </>
            )}
        </div>
    )
}
