import React from 'react'
import { Label, Button } from 'semantic-ui-react'
import { useMutation, useQuery } from 'react-query'
import { regenerateFriendCode, getFriendCode } from '../RoutesAuthenticated'
import * as QuerySettings from '../QuerySettings'
import './FriendCodeDisplay.css'

export default function () {
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
