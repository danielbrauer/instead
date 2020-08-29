import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Button, Form, Icon, Item, Segment } from 'semantic-ui-react'
import { useInput } from './Components/useInput'
import CurrentUser from './CurrentUser'
import { encryptAndUploadProfile, getProfile } from './postCrypto'
import { longLivedQuery } from './QuerySettings'

export default function ({ userId }: { userId: number }) {
    const [editing, setEditing] = useState(false)
    const user = useQuery(['userProfile', userId], getProfile, longLivedQuery)
    const { value: newName, setValue: setNewName, bind: bindNewName } = useInput('')
    const [setProfileNameMutation, setProfileNameStatus] = useMutation(encryptAndUploadProfile)

    const startEditing = () => {
        setNewName(user.data || '')
        setEditing(true)
    }

    const submitForm: React.FormEventHandler = async () => {
        await setProfileNameMutation(newName)
        setEditing(false)
    }

    return (
        <Segment>
            {editing ? (
                <Form loading={setProfileNameStatus.isLoading} onSubmit={submitForm}>
                    <Form.Input label='Display Name' {...bindNewName} />
                    <Button floated='right' primary content='Save' />
                    <Button onClick={() => setEditing(false)} content='Cancel' />
                </Form>
            ) : (
                <Item.Group>
                    <Item>
                        <Item.Header>
                            <Icon name='user' size='large' />
                            {user.data ? user.data! : userId.toString()}
                        </Item.Header>
                        <Item.Extra>
                            {userId === CurrentUser.getId() && (
                                <Button
                                    {...(user.data === null
                                        ? {
                                              labelPosition: 'left',
                                              label: {
                                                  content: 'Add a display name which other people can see',
                                              },
                                          }
                                        : null)}
                                    floated='right'
                                    onClick={startEditing}
                                    icon='pencil'
                                />
                            )}
                        </Item.Extra>
                    </Item>
                </Item.Group>
            )}
        </Segment>
    )
}
