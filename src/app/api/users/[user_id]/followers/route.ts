import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ user_id: string }> }) {
    try {
        const { user_id } = await params

        // Check if user exists
        const user = await prisma.profile.findUnique({
            where: { id: user_id },
        })
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        // Get followers with pagination
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const [followers, totalCount] = await Promise.all([
            prisma.follow.findMany({
                where: { followingId: user_id },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    follower: {
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
            prisma.follow.count({
                where: { followingId: user_id },
            }),
        ])

        return NextResponse.json(
            {
                success: true,
                data: followers.map(follow => follow.follower),
                pagination: {
                    page,
                    limit,
                    pages: Math.ceil(totalCount / limit),
                },
                totalCount,
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
