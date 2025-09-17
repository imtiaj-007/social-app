import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/types/user'
import z from 'zod'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = registerSchema.parse(body)

        // Check if username or email already exists
        const existingUser = await prisma.profile.findFirst({
            where: {
                OR: [{ username: validatedData.username }, { id: validatedData.id }],
            },
        })

        if (existingUser) {
            return Response.json({ success: false, error: 'User already exists' }, { status: 409 })
        }

        // Create new profile
        const profile = await prisma.profile.create({
            data: validatedData,
        })

        return Response.json({ success: true, data: { id: profile.id } }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json(
                { success: false, error: 'Invalid input data', details: error.message },
                { status: 400 }
            )
        }
        return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET() {
    return Response.json({ success: true, data: 'Thank you!' }, { status: 200 })
}
