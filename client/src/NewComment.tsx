import React from 'react'
import { useMutation } from 'react-query'
import { Form } from 'semantic-ui-react'
import { Post } from '../../backend/src/types/api'
import { useInput } from './Components/useInput'
import { encryptAndPostComment } from './postCrypto'

export default function ({ post }: { post: Post }) {
    const contentInput = useInput('')
    const [commentMutation, commentStatus] = useMutation(encryptAndPostComment)

    async function onSubmit() {
        await commentMutation({ post, comment: contentInput.value })
        contentInput.reset()
    }

    return (
        <Form size='large' reply loading={commentStatus.isLoading}>
            <Form.Input
                action={{
                    primary: true,
                    type: 'submit',
                    content: 'Reply',
                    disabled: contentInput.value === '',
                    onClick: onSubmit,
                }}
                placeholder='Write a comment...'
                {...contentInput.bind}
            />
        </Form>
    )
}
