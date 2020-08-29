import React from 'react'
import { useQuery } from 'react-query'
import { Icon, Label } from 'semantic-ui-react'
import InternalLink from './Components/InternalLink'
import { getProfile } from './postCrypto'

export default function UserInList({ id }: { id: number }) {
    const user = useQuery(['userProfile', id], getProfile)
    return (
        <>
            <Icon size='big' name='user' />
            {user.data ? (
                <InternalLink to={`/user/${id.toString()}`}>{user.data!}</InternalLink>
            ) : (
                <Label content={`user#${id.toString()}`} />
            )}
        </>
    )
}
