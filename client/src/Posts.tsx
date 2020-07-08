import React from 'react'
import { useQuery } from 'react-query'
import CurrentUser from './CurrentUser'
import { List, Message, Loader } from 'semantic-ui-react'
import { User } from './Interfaces'
import EncryptedImage from './EncryptedImage'
import SafetyButton from './SafetyButton'
import { getPosts } from './RoutesAuthenticated'

export interface PostsProps {
    // posts: Post[],
    contentUrl: string,
    delete: (id : number) => void,
    getUser: (userid : number) => User,
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
                        {CurrentUser.getId() === post.author_id ?
                            <List.Content floated='right'>
                                <SafetyButton size='mini' onClick={() => props.delete(post.id)}>Delete</SafetyButton>
                            </List.Content>
                            :
                            null}
                        <List.Icon name='user' />
                        <List.Content>{props.getUser(post.author_id).username}</List.Content>
                        <EncryptedImage encryptedUrl={props.contentUrl + post.filename} iv={post.iv} decKey={post.key} />
                    </List.Item>
                ))}
            </List>
            }
        </div>
    )
}