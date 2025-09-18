import { notFound } from 'next/navigation'
import { getUserById, getUserFollowers, getUserFollowing } from '@/services/userService'
import UserProfile from '@/components/UserProfile'
import type { Profile } from '@/generated/prisma'

interface ProfilePageProps {
    params: Promise<{
        user_id: string
    }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { user_id: userId } = await params

    try {
        const [userResponse, followersResponse, followingResponse] = await Promise.all([
            getUserById(userId),
            getUserFollowers(userId, 1, 20),
            getUserFollowing(userId, 1, 20),
        ])

        if (!userResponse.success || !userResponse.data) {
            notFound()
        }

        const user = userResponse.data as Profile
        const followersCount = followersResponse.success ? followersResponse.totalCount || 0 : 0
        const followingCount = followingResponse.success ? followingResponse.totalCount || 0 : 0

        // Pass the fetched data to the client component
        return (
            <UserProfile
                user={user}
                userId={userId}
                followers={followersResponse.data as Profile[]}
                following={followingResponse.data as Profile[]}
                initialFollowersCount={followersCount}
                initialFollowingCount={followingCount}
            />
        )
    } catch (error) {
        notFound()
    }
}
