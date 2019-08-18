import React from 'react'
import CurrentUser from './CurrentUser'
import { Button, List, Image } from 'semantic-ui-react'

export default function (props) {
    return (
        <div>
            <List>
                {props.posts.map((post) => (
                    <List.Item key={post._id}>
                        {CurrentUser.getPayload().userid === post.userid ?
                            <Button onClick={() => props.callbacks.delete(post._id)}>Delete</Button> : null}
                        <List.Content>{props.callbacks.getUser(post.userid).username}</List.Content>
                        <Image fluid src={props.contentUrl + post._id} alt={post._id} />
                    </List.Item>
                ))}
            </List>
        </div>
    )
}