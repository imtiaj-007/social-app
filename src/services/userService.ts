import { Follow, Profile } from '@/generated/prisma'
import { apiClient } from '@/lib/apiClient'
import { CreateUser, UpdateUser } from '@/types/user'

interface ResponseData<T> {
    success: boolean
    data?: T
    error?: unknown
}

export async function registerUser(payload: CreateUser): Promise<ResponseData<Profile>> {
    try {
        const response = await apiClient.post('/auth/register', payload)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function getUsers(
    search?: string,
    page: number = 1,
    limit: number = 20
): Promise<ResponseData<Profile[]>> {
    try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const response = await apiClient.get(`/users?${params.toString()}`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function getUserById(userId: string): Promise<ResponseData<Profile>> {
    try {
        const response = await apiClient.get(`/users/${userId}`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function getCurrentUser(): Promise<ResponseData<Profile>> {
    try {
        const response = await apiClient.get('/users/me')
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function updateCurrentUser(payload: UpdateUser): Promise<ResponseData<Profile>> {
    try {
        const response = await apiClient.put('/users/me', payload)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function followUser(userId: string): Promise<ResponseData<Follow>> {
    try {
        const response = await apiClient.post(`/users/${userId}/follow`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function unfollowUser(userId: string): Promise<ResponseData<{ message: string }>> {
    try {
        const response = await apiClient.delete(`/users/${userId}/follow`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function getUserFollowers(
    userId: string,
    page: number = 1,
    limit: number = 20
): Promise<ResponseData<Profile[]> & { totalCount?: number }> {
    try {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const response = await apiClient.get(`/users/${userId}/followers?${params.toString()}`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}

export async function getUserFollowing(
    userId: string,
    page: number = 1,
    limit: number = 20
): Promise<ResponseData<Profile[]> & { totalCount?: number }> {
    try {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const response = await apiClient.get(`/users/${userId}/following?${params.toString()}`)
        return response.data
    } catch (error) {
        return { success: false, error }
    }
}
