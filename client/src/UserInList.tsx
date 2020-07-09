import React from 'react'
import { List, Icon } from "semantic-ui-react"
import { useQuery } from 'react-query'
import { getUser } from './RoutesAuthenticated'

export default function UserInList(props: { id: number }) {
    const user = useQuery(['user', props.id], getUser)
    return (
        <List.Content>
            <Icon size='big' name='user' />
            {user.data ? user.data!.username : 'loading'}
        </List.Content>
    )
}