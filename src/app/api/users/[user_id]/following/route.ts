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

        // Get following with pagination
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const [following, totalCount] = await Promise.all([
            prisma.follow.findMany({
                where: { followerId: user_id },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    following: {
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
                where: { followerId: user_id },
            }),
        ])

        return NextResponse.json(
            {
                success: true,
                data: following.map(follow => follow.following),
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
