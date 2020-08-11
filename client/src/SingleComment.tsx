import React from 'react'
import * as Types from '../../backend/src/types/api'
import { Comment, Placeholder } from 'semantic-ui-react'
import moment from 'moment'
import { useQuery } from 'react-query'
import { getUser } from './RoutesAuthenticated'
import { useEncryptedComment } from './postCrypto'

export default function(props: {comment: Types.Comment}) {
    const userQuery = useQuery(['users', props.comment.authorId], getUser)
    const decryptedComment = useEncryptedComment(props.comment.key, props.comment.content, props.comment.contentIv)
    return (
        <Comment>
            <Comment.Content>
                <Comment.Author as='a' content={userQuery.isSuccess ? userQuery.data.username : 'User'} />
                <Comment.Metadata content={moment(props.comment.published).fromNow()} />
                {decryptedComment.isLoading
                ?
                    <Placeholder><Placeholder.Line /></Placeholder>
                :
                <Comment.Text content={decryptedComment.results} />}

            </Comment.Content>
        </Comment>
    )
}