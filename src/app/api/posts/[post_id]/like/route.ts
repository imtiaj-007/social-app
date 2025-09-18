import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { post_id: string } }) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const postId = params.post_id
        const userId = user.id

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId, isActive: true },
        })

        if (!post) {
            return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
        }

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        })

        if (existingLike) {
            return NextResponse.json(
                { success: false, message: 'Post already liked' },
                { status: 400 }
            )
        }

        // Create like and update post count in a transaction
        const result = await prisma.$transaction([
            prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            }),
            prisma.post.update({
                where: { id: postId },
                data: {
                    likeCount: { increment: 1 },
                },
            }),
        ])

        return NextResponse.json({ success: true, data: result[0] }, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request, { params }: { params: { post_id: string } }) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const postId = params.post_id
        const userId = user.id

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId, isActive: true },
        })

        if (!post) {
            return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
        }

        // Check if like exists
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        })

        if (!existingLike) {
            return NextResponse.json({ success: false, message: 'Post not liked' }, { status: 400 })
        }

        // Delete like and update post count in a transaction
        await prisma.$transaction([
            prisma.like.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId,
                    },
                },
            }),
            prisma.post.update({
                where: { id: postId },
                data: {
                    likeCount: { decrement: 1 },
                },
            }),
        ])

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}
