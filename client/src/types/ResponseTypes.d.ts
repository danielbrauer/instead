export interface Post {
    id: number
    timestamp: Date
    key: Json
    iv: string
    author_id: number
    filename: string
    published: boolean
}

export interface PostsResponse {
    success: boolean
    posts: Post[]
}