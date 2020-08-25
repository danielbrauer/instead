import React from 'react'
import { useInfiniteQuery } from 'react-query'
import { getUserPosts } from './routes/api'
import { useParams } from 'react-router-dom'
import Posts from './Posts'
import UserInList from './UserInList'
// import { Form } from 'semantic-ui-react'

export default function () {
    const { id: userId } = useParams()
    const posts = useInfiniteQuery(['posts', userId], getUserPosts, {
        getFetchMore: (lastGroup, allGroups) => lastGroup.length > 0 && lastGroup[lastGroup.length - 1].index,
    })

    return (
        <>
            <UserInList id={userId} />
            {/* <Form></Form> */}
            <Posts posts={posts} />
        </>
    )
}
