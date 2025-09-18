import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createCommentSchema } from '@/types/post'

export async function POST(request: Request, { params }: { params: Promise<{ post_id: string }> }) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { post_id: postId } = await params
        const body = await request.json()
        const validatedData = createCommentSchema.parse(body)

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId, isActive: true },
        })

        if (!post) {
            return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
        }

        // Create comment and update post comment count in a transaction
        const result = await prisma.$transaction([
            prisma.comment.create({
                data: {
                    content: validatedData.content,
                    postId,
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
            }),
            prisma.post.update({
                where: { id: postId },
                data: {
                    commentCount: { increment: 1 },
                },
            }),
        ])

        return NextResponse.json({ success: true, data: result[0] }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: 'Invalid input', details: error },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ post_id: string }> }) {
    try {
        const { post_id: postId } = await params

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId, isActive: true },
        })

        if (!post) {
            return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
        }

        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const comments = await prisma.comment.findMany({
            where: {
                postId,
                isActive: true,
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
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        })

        const totalCount = await prisma.comment.count({
            where: {
                postId,
                isActive: true,
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: comments,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    hasNext: skip + limit < totalCount,
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
