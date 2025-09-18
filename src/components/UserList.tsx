'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Profile } from '@/generated/prisma'

interface UserListProps {
    users: Profile[]
}

export default function UserList({ users }: UserListProps) {
    const getInitials = (
        firstName?: string | null,
        lastName?: string | null,
        username?: string
    ) => {
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`
        }
        return username?.[0]?.toUpperCase() || 'U'
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {users.map(user => (
                <Link
                    key={user.id}
                    href={`/profile/${user.id}`}
                    className="bg-card flex items-center gap-0.5 cursor-pointer border rounded-lg p-2">
                    <Avatar className="h-8 w-8 mr-3">
                        {user.avatarUrl ? (
                            <AvatarImage
                                src={user.avatarUrl}
                                alt={user.username || 'User'}
                            />
                        ) : null}
                        <AvatarFallback>
                            {getInitials(user?.firstName, user?.lastName, user?.username)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold">
                            {`${user?.firstName} ${user?.lastName}`}
                        </h3>
                        <p className="text-xs text-muted-foreground">{user.username}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
