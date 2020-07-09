import React from 'react'
import CurrentUser from "./CurrentUser";
import { Post } from '../../backend/src/types/api'
import { useMutation, useQuery } from "react-query"
import { getUser, deletePost } from './RoutesAuthenticated'
import { List } from "semantic-ui-react";
import SafetyButton from "./SafetyButton";

export interface Props {
    post: Post
}

export default function PostHeader({ post } : Props) {
    const username = useQuery(['user', post.author_id], getUser)
    const [deletePostMutation] = useMutation(deletePost)
    return (
        <div>
            {CurrentUser.getId() === post.author_id ?
                <List.Content floated='right'>
                    <SafetyButton size='mini' onClick={() => deletePostMutation(post.id)}>Delete</SafetyButton>
                </List.Content>
                :
                null}
            <List.Icon name='user' />
            <List.Content>{username.data ? username.data!.username : 'loading'}</List.Content>
        </div>
    )
}