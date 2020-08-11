import React from 'react'
import { Post } from '../../backend/src/types/api'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from 'react-query'
import { encryptAndPostComment } from './postCrypto'
import { useInput } from './Components/useInput'

export interface Props {
    post: Post
}

export default function(props: Props) {
    const content = useInput('')
    const [commentMutation, commentStatus] = useMutation(encryptAndPostComment)

    async function onSubmit() {
        await commentMutation({post: props.post, content: content.value})
        content.reset()
    }

    return (
        <Form reply loading={commentStatus.isLoading}>
            <Form.Input placeholder='Write a comment...' {...content.bind}/>
            <Button content='Reply' primary onClick={onSubmit} />
        </Form>
    )
}