import React from 'react'
import CurrentUser from './CurrentUser'
import { List, Message } from 'semantic-ui-react'
import { Post, User } from './Interfaces'
import EncryptedImage from './EncryptedImage'
import SafetyButton from './SafetyButton'

export interface PostsProps {
    posts: Post[],
    contentUrl: string,
    delete: (id : number) => void,
    getUser: (userid : number) => User,
}

export default function (props : PostsProps) {
    return (
        <div>
            {props.posts.length === 0 ?
            <Message>Your posts will appear here, along with those of the people you follow.
                <br/><br/>
                To post a photo or follow people, use the menu in the upper-right.</Message>
            :
            <List>
                {props.posts.map(post => (
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