import React from 'react'
import { Icon } from 'semantic-ui-react'
import { useQuery } from 'react-query'
import { getUser } from './RoutesAuthenticated'
import InternalLink from './Components/InternalLink'

export default function UserInList({ id }: { id: number }) {
    const user = useQuery(['user', id], getUser)
    return (
        <>
            <Icon size='big' name='user' />
            <InternalLink to={`/user/${id.toString()}`}>{user.data ? user.data!.displayName : 'loading'}</InternalLink>
        </>
    )
}
