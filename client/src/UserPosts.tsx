import React from 'react'
import { useInfiniteQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import Posts from './Posts'
import Profile from './Profile'
import { getUserPosts } from './routes/api'

export default function ({ logout }: { logout: () => void }) {
    const { id: userIdString } = useParams<{ id: string }>()
    const userId = parseInt(userIdString)

    const posts = useInfiniteQuery(['posts', userId], getUserPosts, {
        getFetchMore: (lastGroup, allGroups) => lastGroup.length > 0 && lastGroup[lastGroup.length - 1].index,
        staleTime: 30,
        refetchOnWindowFocus: 'always',
    })

    return (
        <>
            <Profile userId={userId} logout={logout} />
            <Posts posts={posts} />
        </>
    )
}
