'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UserList from '@/components/UserList'
import {
    Calendar,
    MapPin,
    Link as LinkIcon,
    Users,
    UserPlus,
    UserCheck,
    Edit,
    ChevronLeft,
    Shield,
} from 'lucide-react'
import type { Profile } from '@/generated/prisma'
import { followUser, unfollowUser } from '@/services/userService'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'

interface UserProfileProps {
    user: Profile
    userId: string
    followers: Profile[]
    following: Profile[]
    initialFollowersCount: number
    initialFollowingCount: number
}

export default function UserProfile({
    user,
    userId,
    followers,
    following,
    initialFollowersCount,
    initialFollowingCount,
}: UserProfileProps) {
    const { user: curUser } = useUser()
    const [isFollowing, setIsFollowing] = useState<boolean>(false)
    const [followersCount, setFollowersCount] = useState<number>(initialFollowersCount)
    const [followingCount] = useState<number>(initialFollowingCount)
    const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false)

    const handleFollowToggle = async () => {
        try {
            setIsFollowLoading(true)
            if (isFollowing) {
                const response = await unfollowUser(userId)
                if (response.success) {
                    setIsFollowing(false)
                    setFollowersCount(prev => prev - 1)
                    toast.success('Unfollowed successfully')
                } else {
                    toast.error('Failed to unfollow user')
                }
            } else {
                const response = await followUser(userId)
                if (response.success) {
                    setIsFollowing(true)
                    setFollowersCount(prev => prev + 1)
                    toast.success('Followed successfully')
                } else {
                    toast.error('Failed to follow user')
                }
            }
        } catch (error) {
            toast.error('Failed to update follow status')
        } finally {
            setIsFollowLoading(false)
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
    }

    useEffect(() => {
        setIsFollowing(followers.some(f => f.id === curUser?.id))
    }, [curUser, followers])

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Link href="/feed">
                <Button variant="outline">
                    <ChevronLeft />
                    Go Back
                </Button>
            </Link>

            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <Card className="my-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <Avatar
                                    className={cn(
                                        'w-24 h-24 relative',
                                        user.role === 'ADMIN' ? 'border-4 border-emerald-400' : ''
                                    )}>
                                    <AvatarImage src={user.avatarUrl || ''} />
                                    <AvatarFallback className="text-2xl">
                                        {getInitials(user.firstName || '', user.lastName || '')}
                                    </AvatarFallback>
                                </Avatar>
                                {user.role === 'ADMIN' && (
                                    <Badge>
                                        <Shield className="size-5" />
                                        Admin
                                    </Badge>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                    <h1 className="text-3xl font-bold">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    {user.username && (
                                        <Badge
                                            variant="secondary"
                                            className="text-sm">
                                            @{user.username}
                                        </Badge>
                                    )}
                                </div>

                                {user.bio && (
                                    <p className="text-muted-foreground mb-4">{user.bio}</p>
                                )}

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                                    {user.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {user.location}
                                        </div>
                                    )}

                                    {user.website && (
                                        <Link
                                            href={user.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 hover:text-primary transition-colors">
                                            <LinkIcon className="h-4 w-4" />
                                            Website
                                        </Link>
                                    )}

                                    {user.createdAt && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Joined {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span className="font-semibold">{followersCount}</span>
                                        <span className="text-muted-foreground">Followers</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4" />
                                        <span className="font-semibold">{followingCount}</span>
                                        <span className="text-muted-foreground">Following</span>
                                    </div>
                                </div>
                            </div>

                            {curUser?.id === user.id ? (
                                <Link href="/profile/me">
                                    <Button>
                                        <Edit />
                                        Edit Profile
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    onClick={handleFollowToggle}
                                    disabled={isFollowLoading}
                                    variant={isFollowing ? 'outline' : 'default'}
                                    className="flex items-center gap-2">
                                    {isFollowing ? (
                                        <>
                                            <UserCheck className="h-4 w-4" />
                                            Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4" />
                                            Follow
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Content Tabs */}
                <Tabs
                    defaultValue="posts"
                    className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts">
                        <h3 className="text-center my-16">User Posts Coming Soon...</h3>
                    </TabsContent>

                    <TabsContent value="followers">
                        <UserList users={followers} />
                    </TabsContent>

                    <TabsContent value="following">
                        <UserList users={following} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
