import React from 'react'
import { useQuery } from 'react-query'
import { Icon, Label } from 'semantic-ui-react'
import InternalLink from './Components/InternalLink'
import { getProfile } from './postCrypto'

interface UserInListProps {
    id: number
}

export default function UserInList({ id }: UserInListProps) {
    const user = useQuery(['userProfile', id], getProfile)
    return (
        <>
            <Icon size='big' name='user' />
            {user.data ? (
                <InternalLink className='display-name' to={`/user/${id.toString()}`}>
                    {user.data!}
                </InternalLink>
            ) : (
                <Label className='display-name' content={`user#${id.toString()}`} />
            )}
        </>
    )
}
