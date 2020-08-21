import React from 'react'
import { Label, Button } from 'semantic-ui-react'
import { useMutation } from 'react-query'
import { regenerateFriendCode } from '../RoutesAuthenticated'
import CurrentUser from '../CurrentUser'

export default function () {
    const [createCodeMutation, createCodeStatus] = useMutation(regenerateFriendCode)
    const friendCode = CurrentUser.getFriendCode() || '-'

    return (
        <>
            Other users can follow you if you give them your Friend Code:
            <br />
            <Label size='massive' content={createCodeStatus.isLoading ? 'Loading...' : friendCode} />
            <Button onClick={() => createCodeMutation()} content='Regenerate' />
        </>
    )
}
