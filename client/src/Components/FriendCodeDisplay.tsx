import React from 'react'
import { Label, Button } from 'semantic-ui-react'
import { useMutation } from 'react-query'
import { regenerateFriendCode } from '../RoutesAuthenticated'
import CurrentUser from '../CurrentUser'
import './FriendCodeDisplay.css'

export default function () {
    const [createCodeMutation, createCodeStatus] = useMutation(regenerateFriendCode)
    const friendCode = CurrentUser.getFriendCode() || '-'

    return (
        <div className='friend-code-display-container'>
            Give your Friend Code to other people to follow you:
            <Label size='massive' circular>
                {createCodeStatus.isLoading ? '...' : friendCode}
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
