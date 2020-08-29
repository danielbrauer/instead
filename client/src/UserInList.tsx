import React from 'react'
import { useQuery } from 'react-query'
import { Icon } from 'semantic-ui-react'
import InternalLink from './Components/InternalLink'
import { getProfile } from './postCrypto'
import { longLivedQuery } from './QuerySettings'

export default function UserInList({ id }: { id: number }) {
    const user = useQuery(['userProfile', id], getProfile, longLivedQuery)
    return (
        <>
            <Icon size='big' name='user' />
            <InternalLink to={`/user/${id.toString()}`}>{user.data ? user.data! : id.toString()}</InternalLink>
        </>
    )
}
