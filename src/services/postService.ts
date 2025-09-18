import { Post } from '@/generated/prisma'
import { apiClient } from '@/lib/apiClient'
import { CreatePost } from '@/types/post'

interface ResponseData<T> {
    success: boolean
    data?: T
    error?: unknown
}

export async function createPost(payload: CreatePost): Promise<ResponseData<Post>> {
    try {
        const response = await apiClient.post('/posts', payload)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function getPosts(
    page: number = 1,
    limit: number = 20
): Promise<ResponseData<Post[]>> {
    try {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const response = await apiClient.get(`/posts?${params.toString()}`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function getPostById(postId: string): Promise<ResponseData<Post>> {
    try {
        const response = await apiClient.get(`/posts/${postId}`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function updatePost(postId: string, payload: CreatePost): Promise<ResponseData<Post>> {
    try {
        const response = await apiClient.put(`/posts/${postId}`, payload)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function deletePost(postId: string): Promise<ResponseData<unknown>> {
    try {
        const response = await apiClient.delete(`/posts/${postId}`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}
