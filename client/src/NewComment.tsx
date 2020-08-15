import React from 'react'
import { Post } from '../../backend/src/types/api'
import { Form } from 'semantic-ui-react'
import { useMutation } from 'react-query'
import { encryptAndPostComment } from './postCrypto'
import { useInput } from './Components/useInput'

export default function ({ post }: { post: Post }) {
    const contentInput = useInput('')
    const [commentMutation, commentStatus] = useMutation(encryptAndPostComment)

    async function onSubmit() {
        await commentMutation({ post, content: contentInput.value })
        contentInput.reset()
    }

    return (
        <Form reply loading={commentStatus.isLoading}>
            <Form.Input
                action={{
                    primary: true,
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
