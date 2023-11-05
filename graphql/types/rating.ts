import { PostType } from "./enums"

export type Rating =  {
    id: string
    userId: string
    stars: number
    createdAt: Date
    comment: string
    usefullRatings: number
    postId: string
    postType: PostType
}