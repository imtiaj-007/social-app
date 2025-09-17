import z from 'zod'

export const registerSchema = z.object({
    id: z.string(),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.email('Invalid email address'),
})

export const updateProfileSchema = z.object({
    firstName: z.string().min(2, 'First name is required').optional(),
    lastName: z.string().min(2, 'Last name is required').optional(),
    bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
    avatarUrl: z.url('Invalid URL format').optional(),
    website: z.url('Invalid URL format').optional(),
    location: z.string().optional(),
})

export type CreateUser = z.infer<typeof registerSchema>
export type UpdateUser = z.infer<typeof updateProfileSchema>
