import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ post_id: string }> }) {
    try {
        const resolvedParams = await params
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const postId = resolvedParams.post_id
        const userId = user.id

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId, isActive: true },
        })

        if (!post) {
            return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
        }

        // Check if user has liked the post
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: {
                    liked: !!existingLike,
                    likeCount: post.likeCount,
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
