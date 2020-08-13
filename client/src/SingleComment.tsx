import React from 'react'
import * as Types from '../../backend/src/types/api'
import { Comment, Placeholder } from 'semantic-ui-react'
import moment from 'moment'
import { useQuery } from 'react-query'
import { getUser } from './RoutesAuthenticated'
import { useEncryptedComment } from './postCrypto'
import InternalLink from './Components/InternalLink'

export default function({ comment } : { comment: Types.Comment}) {
    const userQuery = useQuery(['users', comment.authorId], getUser)
    const decryptedComment = useEncryptedComment(comment)
    return (
        <Comment>
            <Comment.Content>
                <InternalLink to={`/user/${comment.authorId.toString()}`}>
                    <Comment.Author content={userQuery.isSuccess ? userQuery.data.username : 'User'} />
                </InternalLink>
                <Comment.Metadata content={moment(comment.published).fromNow()} />
                {decryptedComment.isLoading
                ?
                    <Placeholder><Placeholder.Line /></Placeholder>
                :
                    <Comment.Text content={decryptedComment.results} />}

            </Comment.Content>
        </Comment>
    )
}