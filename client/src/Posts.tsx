import React from 'react'
import CurrentUser from './CurrentUser'
import { Button, List } from 'semantic-ui-react'
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
            <List>
                {props.posts.map(post => (
                    <List.Item key={post.id}>
                        {CurrentUser.getId() === post.author_id ?
                            <SafetyButton onClick={() => props.delete(post.id)}>Delete</SafetyButton> : null}
                        <List.Content>{props.getUser(post.author_id).username}</List.Content>
                        <EncryptedImage encryptedUrl={props.contentUrl + post.filename} iv={post.iv} decKey={post.key} />
                    </List.Item>
                ))}
            </List>
        </div>
    )
}