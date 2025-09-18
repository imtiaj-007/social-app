import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: Promise<{ user_id: string }> }) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { user_id: targetUserId } = await params

        // Check if target user exists
        const targetUser = await prisma.profile.findUnique({
            where: { id: targetUserId },
        })
        if (!targetUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: user.id,
                    followingId: targetUserId,
                },
            },
        })

        if (existingFollow) {
            return NextResponse.json(
                { success: false, message: 'Already following this user' },
                { status: 400 }
            )
        }

        // Create follow relationship
        const follow = await prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: targetUserId,
            },
        })

        return NextResponse.json({ success: true, data: follow }, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ user_id: string }> }
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

        const { user_id: targetUserId } = await params

        // Check if target user exists
        const targetUser = await prisma.profile.findUnique({
            where: { id: targetUserId },
        })
        if (!targetUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        // Check if following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: user.id,
                    followingId: targetUserId,
                },
            },
        })

        if (!existingFollow) {
            return NextResponse.json(
                { success: false, message: 'Not following this user' },
                { status: 400 }
            )
        }

        // Delete follow relationship
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: user.id,
                    followingId: targetUserId,
                },
            },
        })

        return NextResponse.json(
            { success: true, message: 'Unfollowed successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error },
            { status: 500 }
        )
    }
}
