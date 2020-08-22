import React from 'react'
import { Icon } from 'semantic-ui-react'
import { useQuery } from 'react-query'
import { getUser } from './routes/api'
import InternalLink from './Components/InternalLink'

export default function UserInList({ id }: { id: number }) {
    const user = useQuery(['user', id], getUser, { staleTime: Infinity })
    return (
        <>
            <Icon size='big' name='user' />
            <InternalLink to={`/user/${id.toString()}`}>
                {user.data ? user.data!.displayName || user.data!.id.toString() : 'loading'}
            </InternalLink>
        </>
    )
}
