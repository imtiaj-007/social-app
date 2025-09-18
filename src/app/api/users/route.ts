import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const profile = await prisma.profile.findUnique({
            where: { id: user.id },
            select: { role: true },
        })

        if (!profile || profile.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, message: 'Forbidden: Admin access required' },
                { status: 403 }
            )
        }

        // Get search parameters
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        // Build search query
        const conditions = search
            ? {
                  OR: [
                      { username: { contains: search } },
                      { firstName: { contains: search } },
                      { lastName: { contains: search } },
                      { email: { contains: search } },
                  ],
              }
            : {}

        // Fetch users with pagination
        const [users, totalCount] = await Promise.all([
            prisma.profile.findMany({
                where: conditions,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                    role: true,
                    createdAt: true,
                },
            }),
            prisma.profile.count({ where: conditions }),
        ])

        return NextResponse.json(
            {
                success: true,
                data: users,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    pages: Math.ceil(totalCount / limit),
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
