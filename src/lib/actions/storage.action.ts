'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveImageToStorage(
    file: File,
    bucketName: string = 'images',
    path?: string
): Promise<{ success: boolean; data?: { path: string; url: string }; error?: string }> {
    try {
        const supabase = await createClient()

        // Generate a unique filename if no path is provided
        const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
        const fileExtension = file.name.split('.').pop()
        const fullPath = `${fileName}.${fileExtension}`

        const { data, error } = await supabase.storage.from(bucketName).upload(fullPath, file, {
            cacheControl: '3600',
            upsert: false,
        })
        if (error) {
            return { success: false, error: error.message }
        }

        // Get the public URL of the uploaded file
        const { data: urlData } = await supabase.storage.from(bucketName).getPublicUrl(fullPath)
        return {
            success: true,
            data: {
                path: data.path,
                url: urlData.publicUrl,
            },
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}
