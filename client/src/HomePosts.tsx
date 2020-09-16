import React from 'react'
import { useInfiniteQuery } from 'react-query'
import { Icon, Message } from 'semantic-ui-react'
import Posts from './Posts'
import { getHomePosts } from './routes/api'

export default function () {
    const posts = useInfiniteQuery('posts', getHomePosts, {
        getFetchMore: (lastGroup, allGroups) => lastGroup.length > 0 && lastGroup[lastGroup.length - 1].index,
        staleTime: 30,
        refetchOnWindowFocus: 'always',
    })

    return (
        <>
            {posts.data === undefined || posts.data[0].length === 0 ? (
                <Message>
                    <Message.Header>Welcome!</Message.Header>
                    Posts will appear here. Use the menu to:
                    <Message.List>
                        <Message.Item>
                            <Icon name='user' />
                            Edit your profile
                        </Message.Item>
                        <Message.Item>
                            <Icon name='users' />
                            Follow friends
                        </Message.Item>
                        <Message.Item>
                            <Icon name='camera' />
                            Post a photo
                        </Message.Item>
                    </Message.List>
                </Message>
            ) : null}

            <Posts posts={posts} />
        </>
    )
}
