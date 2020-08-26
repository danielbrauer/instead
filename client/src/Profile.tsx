import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import CurrentUser from './CurrentUser'
import { Button, Form, Input, Icon } from 'semantic-ui-react'
import { useInput } from './Components/useInput'
import { getProfile, encryptAndUploadProfile } from './postCrypto'
import InternalLink from './Components/InternalLink'

export default function ({ userId }: { userId: number }) {
    const [editing, setEditing] = useState(false)
    const user = useQuery(['userProfile', userId], getProfile, { staleTime: Infinity })
    const { value: newName, reset: resetNewName, bind: bindNewName } = useInput('')
    const [setProfileNameMutation, setProfileNameStatus] = useMutation(encryptAndUploadProfile)

    const toggleEditing: React.MouseEventHandler = () => {
        if (!editing) resetNewName()
        setEditing(!editing)
    }

    const submitForm: React.FormEventHandler = async () => {
        setEditing(false)
        await setProfileNameMutation(newName)
    }

    return (
        <>
            <Icon size='big' name='user' />
            {editing ? (
                <Form onSubmit={submitForm}>
                    <Input {...bindNewName} />
                </Form>
            ) : (
                <InternalLink to={`/user/${userId.toString()}`}>
                    {user.data ? user.data! : userId.toString()}
                </InternalLink>
            )}
            {userId === CurrentUser.getId() ? (
                <Button
                    loading={setProfileNameStatus.isLoading}
                    toggle
                    active={editing}
                    onClick={toggleEditing}
                    icon='pencil'
                />
            ) : null}
        </>
    )
}
