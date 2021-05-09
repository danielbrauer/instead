import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { Button, Label } from 'semantic-ui-react'
import * as QuerySettings from '../QuerySettings'
import { getFriendCode, regenerateFriendCode } from '../routes/api'
import './FriendCodeDisplay.css'

export default function FriendCodeDisplay() {
    const friendCodeQuery = useQuery('friendCode', getFriendCode, QuerySettings.longLivedQuery)
    const [createCodeMutation, createCodeStatus] = useMutation(regenerateFriendCode)

    return (
        <div className='friend-code-display-container'>
            Give your Friend Code to other people to follow you:
            <Label size='massive' circular>
                {friendCodeQuery.isLoading || createCodeStatus.isLoading
                    ? '...'
                    : friendCodeQuery.isSuccess
                    ? friendCodeQuery.data || '-'
                    : 'error'}
            </Label>
            <Button
                size='tiny'
                onClick={() => createCodeMutation()}
                icon='redo alternate'
                loading={createCodeStatus.isLoading}
            />
        </div>
    )
}
