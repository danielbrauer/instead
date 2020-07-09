import React from 'react'
import { useQuery } from 'react-query'
import { List, Message, Loader } from 'semantic-ui-react'
import EncryptedImage from './EncryptedImage'
import { getPosts } from './RoutesAuthenticated'
import PostHeader from './PostHeader'

export interface PostsProps {
    contentUrl: string,
}

export default function (props : PostsProps) {
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
            <Message>Your posts will appear here, along with those of the people you follow.
                <br/><br/>
                To post a photo or follow people, use the menu in the upper-right.</Message>
            :
            <List>
                {posts.data!.map(post => (
                    <List.Item key={post.id}>
                        <PostHeader post={post} />
                        <EncryptedImage encryptedUrl={props.contentUrl + post.filename} iv={post.iv} decKey={post.key} />
                    </List.Item>
                ))}
            </List>
            }
        </div>
    )
}