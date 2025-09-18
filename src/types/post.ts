import { z } from 'zod'
import type { Prisma } from '@/generated/prisma'

export const createPostSchema = z.object({
    content: z
        .string()
        .min(1, 'Content is required')
        .max(280, 'Content cannot exceed 280 characters'),
    category: z.enum(['GENERAL', 'ANNOUNCEMENT', 'QUESTION']).default('GENERAL').optional(),
    imageUrl: z.string().optional().or(z.literal('')),
})

export type CreatePost = z.infer<typeof createPostSchema>

export type PostWithAuthor = Prisma.PostGetPayload<{
    include: { author: true }
}>

export type PostsWithAuthor = PostWithAuthor[]
