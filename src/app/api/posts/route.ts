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

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '20')
        const cursor = searchParams.get('cursor')

        const validatedLimit = Math.min(Math.max(limit, 1), 20)

        const posts = await prisma.post.findMany({
            where: { isActive: true },
            take: validatedLimit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            orderBy: { createdAt: 'desc' },
            include: { author: true },
        })

        // Check if current user has liked each post
        let userLikes = new Set()
        if (user) {
            const postIds = posts.map(post => post.id)
            const likes = await prisma.like.findMany({
                where: {
                    userId: user.id,
                    postId: { in: postIds },
                },
                select: { postId: true },
            })
            userLikes = new Set(likes.map(like => like.postId))
        }

        // Process posts to add isLiked field
        const processedPosts = posts.map(post => ({
            ...post,
            isLiked: userLikes.has(post.id),
        }))

        const hasMore = processedPosts.length > limit
        const data = hasMore ? processedPosts.slice(0, -1) : processedPosts
        const nextCursor = hasMore ? (data[data.length - 1]?.id ?? null) : null

        return NextResponse.json(
            {
                success: true,
                data: processedPosts,
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
