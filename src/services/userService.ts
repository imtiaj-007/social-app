import { apiClient } from '@/lib/apiClient'
import { CreateUser } from '@/types/user'

interface ResponseData {
    success: boolean
    data?: unknown
    error?: unknown
}

export async function registerUser(payload: CreateUser): Promise<ResponseData> {
    try {
        const response = await apiClient.post('/users/register', payload)
        return { success: true, data: response.data }
    } catch (error) {
        return { success: false, error }
    }
}
