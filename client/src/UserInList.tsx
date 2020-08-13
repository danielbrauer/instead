import React from 'react'
import { List, Icon } from "semantic-ui-react"
import { useQuery } from 'react-query'
import { getUser } from './RoutesAuthenticated'
import { Link } from 'react-router-dom'

export default function UserInList({ id } : { id: number}) {
    const user = useQuery(['user', id], getUser)
    return (
        <List.Content>
            <Icon size='big' name='user' />
            <Link to={`/user/${id.toString()}`}>
                {user.data ? user.data!.username : 'loading'}
            </Link>
        </List.Content>
    )
}