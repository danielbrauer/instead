import React from 'react'
import { Icon } from 'semantic-ui-react'
import { useQuery } from 'react-query'
import { getProfile } from './postCrypto'
import InternalLink from './Components/InternalLink'

export default function UserInList({ id }: { id: number }) {
    const user = useQuery(['userProfile', id], getProfile, { staleTime: Infinity })
    return (
        <>
            <Icon size='big' name='user' />
            <InternalLink to={`/user/${id.toString()}`}>{user.data ? user.data! : id.toString()}</InternalLink>
        </>
    )
}
