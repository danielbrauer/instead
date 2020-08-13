import React from 'react'
import CurrentUser from "./CurrentUser";
import { Post } from '../../backend/src/types/api'
import { useMutation, useQuery } from "react-query"
import { getUser, deletePost } from './RoutesAuthenticated'
import { List } from "semantic-ui-react";
import SafetyButton from "./SafetyButton";
import UserInList from './UserInList';

export interface Props {
    post: Post
}

export default function PostHeader({ post } : Props) {
    const [deletePostMutation] = useMutation(deletePost)
    return (
        <div>
            {CurrentUser.getId() === post.authorId ?
                <List.Content floated='right'>
                    <SafetyButton size='mini' onClick={() => deletePostMutation(post.id)}>Delete</SafetyButton>
                </List.Content>
                :
                null}
            <UserInList id={post.authorId} />
        </div>
    )
}