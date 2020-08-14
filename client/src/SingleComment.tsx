import React from 'react'
import * as Types from '../../backend/src/types/api'
import { Comment, Placeholder, Icon } from 'semantic-ui-react'
import moment from 'moment'
import { useQuery } from 'react-query'
import { getUser } from './RoutesAuthenticated'
import { useEncryptedComment } from './postCrypto'
import UserInList from './UserInList'

export default function({ comment } : { comment: Types.Comment}) {
    const decryptedComment = useEncryptedComment(comment)
    return (
        <Comment>
            <Comment.Content>
                <UserInList id={comment.authorId}/>
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