import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createPostSchema } from '@/types/post'

export async function POST(request: NextRequest) {
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
        const limit = parseInt(searchParams.get('limit') || '20')
        const cursor = searchParams.get('cursor')

        const validatedLimit = Math.min(Math.max(limit, 1), 20)

        const posts = await prisma.post.findMany({
            where: { isActive: true },
            take: validatedLimit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
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
        })

        const hasMore = posts.length > limit
        const data = hasMore ? posts.slice(0, -1) : posts
        const nextCursor = hasMore ? (data[data.length - 1]?.id ?? null) : null

        return NextResponse.json(
            {
                success: true,
                data: posts,
                nextCursor,
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
