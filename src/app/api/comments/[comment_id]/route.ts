import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ comment_id: string }> }
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

        const { comment_id: commentId } = await params

        // Check if comment exists and belongs to user
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { authorId: true, postId: true },
        })

        if (!existingComment) {
            return NextResponse.json(
                { success: false, message: 'Comment not found' },
                { status: 404 }
            )
        }

        if (existingComment.authorId !== user.id) {
            return NextResponse.json(
                { success: false, message: 'Forbidden: You can only delete your own comments' },
                { status: 403 }
            )
        }

        // Soft delete comment and update post comment count in a transaction
        await prisma.$transaction([
            prisma.comment.update({
                where: { id: commentId },
                data: { isActive: false },
            }),
            prisma.post.update({
                where: { id: existingComment.postId },
                data: {
                    commentCount: { decrement: 1 },
                },
            }),
        ])

        return NextResponse.json(
            { success: true, message: 'Comment deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}
