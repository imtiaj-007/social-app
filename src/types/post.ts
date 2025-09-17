import { z } from 'zod'

export const createPostSchema = z.object({
    content: z.string().max(280, 'Content cannot exceed 280 characters'),
    imageUrl: z.url().optional().or(z.literal('')),
    category: z.enum(['GENERAL', 'ANNOUNCEMENT', 'QUESTION']).default('GENERAL'),
})

export type CreatePost = z.infer<typeof createPostSchema>
