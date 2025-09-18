import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createPostSchema } from '@/types/post'

export async function GET(request: Request, { params }: { params: Promise<{ post_id: string }> }) {
    try {
        const { post_id } = await params

        const post = await prisma.post.findUnique({
            where: { id: post_id, isActive: true },
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

        if (!post) {
            return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: post }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ post_id: string }> }) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { post_id } = await params
        const body = await request.json()
        const validatedData = createPostSchema.parse(body)

        // Check if post exists and belongs to user
        const existingPost = await prisma.post.findUnique({
            where: { id: post_id },
            select: { authorId: true },
        })

        if (!existingPost) {
            return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
        }

        if (existingPost.authorId !== user.id) {
            return NextResponse.json(
                { success: false, message: 'Forbidden: You can only update your own posts' },
                { status: 403 }
            )
        }

        const updatedPost = await prisma.post.update({
            where: { id: post_id },
            data: {
                content: validatedData.content,
                imageUrl: validatedData.imageUrl || null,
                category: validatedData.category,
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

        return NextResponse.json({ success: true, data: updatedPost }, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: 'Invalid input data', details: error },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ post_id: string }> }
) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { post_id } = await params

        // Check if post exists and belongs to user
        const existingPost = await prisma.post.findUnique({
            where: { id: post_id },
            select: { authorId: true },
        })

        if (!existingPost) {
            return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
        }

        if (existingPost.authorId !== user.id) {
            return NextResponse.json(
                { success: false, message: 'Forbidden: You can only delete your own posts' },
                { status: 403 }
            )
        }

        // Soft delete by setting isActive to false
        await prisma.post.update({
            where: { id: post_id },
            data: { isActive: false },
        })

        return NextResponse.json(
            { success: true, message: 'Post deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}
