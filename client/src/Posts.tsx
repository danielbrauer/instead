import React from 'react'
import CurrentUser from './CurrentUser'
import { Button, List } from 'semantic-ui-react'
import { Post, User } from './Interfaces'
import EncryptedImage from './EncryptedImage'

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
                {props.posts.map((post) => (
                    <List.Item key={post.id}>
                        {CurrentUser.getPayload().userid === post.author_id ?
                            <Button onClick={() => props.delete(post.id)}>Delete</Button> : null}
                        <List.Content>{props.getUser(post.author_id).username}</List.Content>
                        <EncryptedImage encryptedUrl={props.contentUrl + post.filename} iv={post.iv} decKey={post.key} />
                    </List.Item>
                ))}
            </List>
        </div>
    )
}