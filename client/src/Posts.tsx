import React from 'react'
import { useQuery } from 'react-query'
import { List, Message, Loader } from 'semantic-ui-react'
import EncryptedImage from './EncryptedImage'
import { getPosts } from './RoutesAuthenticated'
import PostHeader from './PostHeader'
import { Link } from 'react-router-dom'

export default function () {
    const posts = useQuery('posts', getPosts)
    if (posts.isError) return (
        <div>
            <Message negative>
                <Message.Header>Error fetching posts</Message.Header>
            </Message>
        </div>
    )
    if (posts.isLoading) return (
        <div>
            <Loader active></Loader>
        </div>
    )
    return (
        <div>
            {posts.data!.length === 0 ?
            <Message>To post a photo or follow people, use the menu ➚</Message>
            :
            <List>
                {posts.data!.map(post => (
                    <List.Item key={post.id}>
                        <PostHeader post={post} />
                        <Link to={`/post/${post.id.toString()}`}>
                        <EncryptedImage post={post} />
                        </Link>
                    </List.Item>
                ))}
            </List>
            }
        </div>
    )
}