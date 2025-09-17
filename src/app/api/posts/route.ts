import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createPostSchema } from '@/types/post'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = createPostSchema.parse(body)

        const post = await prisma.post.create({
            data: {
                content: validatedData.content,
                imageUrl: validatedData.imageUrl || null,
                category: validatedData.category,
                authorId: user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        })

        return NextResponse.json({ success: true, data: post }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: 'Invalid input data', details: error },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const [posts, totalCount] = await Promise.all([
            prisma.post.findMany({
                where: { isActive: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        },
                    },
                },
            }),
            prisma.post.count({ where: { isActive: true } }),
        ])

        return NextResponse.json(
            {
                success: true,
                data: posts,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasNext: page * limit < totalCount,
                    hasPrevious: page > 1,
                },
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}
