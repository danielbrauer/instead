import React from 'react'
import { useInfiniteQuery } from 'react-query'
import { getHomePosts } from './routes/api'
import Posts from './Posts'

export default function () {
    const posts = useInfiniteQuery('posts', getHomePosts, {
        getFetchMore: (lastGroup, allGroups) => lastGroup.length > 0 && lastGroup[lastGroup.length - 1].index,
        staleTime: Infinity,
    })

    return <Posts posts={posts} />
}
