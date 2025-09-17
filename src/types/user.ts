import z from 'zod'

export const registerSchema = z.object({
    id: z.string(),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.email('Invalid email address'),
    bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
    avatarUrl: z.url('Invalid URL').optional(),
    website: z.url('Invalid URL').optional(),
    location: z.string().optional(),
    role: z.enum(['USER', 'ADMIN']).default('USER').optional(),
})

export type CreateUser = z.infer<typeof registerSchema>
