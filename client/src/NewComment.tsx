import React from 'react'
import { Post } from '../../backend/src/types/api'
import { Form, Button, Loader } from 'semantic-ui-react'
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
        await commentMutation({ postId: props.post.id, keySetId: props.post.keySetId, content: content.value })
    }

    return (
        <Form reply loading={commentStatus.isLoading}>
            <Form.Input placeholder='Write a comment...' {...content.bind}/>
            <Button content='Reply' primary onClick={onSubmit} />
        </Form>
    )
}