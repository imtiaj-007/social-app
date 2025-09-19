'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmationModal } from '@/components/modal/ConfirmationModal'
import { Shield, Eye, Ban, Trash2, Calendar, MapPin, Link as LinkIcon, User } from 'lucide-react'
import type { Profile } from '@/generated/prisma'

interface UsercardProps {
    user: Profile
    onView?: (user: Profile) => void
    onBlock?: (user: Profile) => void
    onDelete?: (user: Profile) => void
}

export default function UserCard({ user, onView, onBlock, onDelete }: UsercardProps) {
    const getInitials = (firstName?: string | null, lastName?: string | null) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                </CardTitle>
                {user.role === 'ADMIN' && (
                    <Badge variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatarUrl || ''} />
                        <AvatarFallback>
                            {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        {user.username && (
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        )}
                        <p className="text-sm">{user.email}</p>
                    </div>
                </div>

                {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}

                <div className="grid grid-cols-2 gap-2 text-sm">
                    {user.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{user.location}</span>
                        </div>
                    )}

                    {user.website && (
                        <Link
                            href={user.website}
                            className="flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" />
                            <span className="truncate">Visit Website</span>
                        </Link>
                    )}

                    {user.createdAt && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">ID: {user.id}</span>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView?.(user)}
                        asChild>
                        <Link href={`/profile/${user.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                        </Link>
                    </Button>

                    {onBlock && (
                        <ConfirmationModal
                            trigger={
                                <Button
                                    variant="outline"
                                    size="sm">
                                    <Ban className="h-4 w-4 mr-1" />
                                    Block
                                </Button>
                            }
                            title="Block User"
                            description={`Are you sure you want to block ${user.firstName} ${user.lastName}?`}
                            confirmText="Block"
                            onConfirm={() => onBlock(user)}
                        />
                    )}

                    {onDelete && (
                        <ConfirmationModal
                            trigger={
                                <Button
                                    variant="destructive"
                                    size="sm">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            }
                            title="Delete User"
                            description={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
                            confirmText="Delete"
                            onConfirm={() => onDelete(user)}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
