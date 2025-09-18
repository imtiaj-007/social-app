import Image from 'next/image'
import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ConfirmationModal } from '@/components/modal/ConfirmationModal'
import { PostModal } from '@/components/modal/PostModal'
import { deletePost } from '@/services/postService'
import type { PostWithAuthor } from '@/types/post'

interface PostCardProps {
    post: PostWithAuthor
    onPostDeleted?: () => void
    isCurrentUserPost: boolean
}

export default function PostCard({ post, onPostDeleted, isCurrentUserPost }: PostCardProps) {
    const [loading, setLoading] = useState<boolean>(false)

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

    const getCategoryVariant = (category: string) => {
        switch (category) {
            case 'ANNOUNCEMENT':
                return 'destructive'
            case 'QUESTION':
                return 'secondary'
            default:
                return 'default'
        }
    }

    const handleDeletePost = async () => {
        setLoading(true)
        try {
            const result = await deletePost(post.id)
            if (result.success) {
                toast.success('Post deleted successfully!')
                if (onPostDeleted) {
                    onPostDeleted()
                }
            } else {
                toast.error('Failed to delete post')
            }
        } catch (error) {
            toast.error('Error deleting post')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center space-y-0 px-4">
                <Avatar className="h-8 w-8 mr-3">
                    {post.author?.avatarUrl ? (
                        <AvatarImage
                            src={post.author.avatarUrl}
                            alt={post.author.username || 'User'}
                        />
                    ) : null}
                    <AvatarFallback>
                        {getInitials(
                            post.author?.firstName,
                            post.author?.lastName,
                            post.author?.username
                        )}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold">
                            {`${post.author?.firstName} ${post.author?.lastName}`}
                        </h3>
                        <div className="flex items-center gap-4">
                            {isCurrentUserPost ? (
                                <>
                                    <ConfirmationModal
                                        trigger={<Trash className="size-4 cursor-pointer" />}
                                        title="Delete Post"
                                        description="Are you sure you want to delete this post? This action cannot be undone."
                                        confirmText="Delete"
                                        variant="destructive"
                                        onConfirm={handleDeletePost}
                                        isLoading={loading}
                                    />
                                    <PostModal
                                        trigger={<Edit className="size-4 cursor-pointer" />}
                                        postId={post.id}
                                        isUpdate={true}
                                    />
                                </>
                            ) : (
                                <>
                                    <Trash className="size-4 opacity-50 cursor-not-allowed" />
                                    <Edit className="size-4 opacity-50 cursor-not-allowed" />
                                </>
                            )}
                            <Badge
                                variant={getCategoryVariant(post.category)}
                                className="text-xs">
                                {post.category.toLowerCase()}
                            </Badge>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-5">
                <p className="col-span-3 text-sm leading-relaxed">{post.content}</p>
                {post.imageUrl && (
                    <div className="col-span-2 flex items-center justify-center">
                        <Image
                            src={post.imageUrl}
                            alt="Post image"
                            width={200}
                            height={200}
                            className="rounded-lg w-auto max-h-48 border object-cover"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
