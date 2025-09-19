import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Edit, Shield, Trash } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ConfirmationModal } from '@/components/modal/ConfirmationModal'
import { PostModal } from '@/components/modal/PostModal'
import { PostActions } from '@/components/PostActions'
import { deletePost } from '@/services/postService'
import type { PostWithAuthor } from '@/types/post'

interface PostCardProps {
    post: PostWithAuthor
    onPostDeleted?: () => void
    isCurrentUserPost: boolean
    isAdmin: boolean
}

export default function PostCard({
    post,
    onPostDeleted,
    isCurrentUserPost,
    isAdmin,
}: PostCardProps) {
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
                return 'success'
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
            <CardHeader className="flex items-center justify-between px-4">
                <Link
                    href={`/profile/${post.authorId}`}
                    className="flex items-center gap-0.5 cursor-pointer">
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
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold">
                            {`${post.author?.firstName} ${post.author?.lastName}`}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                    {post.author.role === 'ADMIN' && (
                        <Badge className="ml-2">
                            <Shield className="size-4" />
                            Admin
                        </Badge>
                    )}
                </Link>
                <div className="flex items-center gap-4">
                    <Badge
                        variant={getCategoryVariant(post.category)}
                        className="text-xs capitalize">
                        {post.category.toLowerCase()}
                    </Badge>
                    {isCurrentUserPost || isAdmin ? (
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
                            {isCurrentUserPost && (
                                <PostModal
                                    trigger={<Edit className="size-4 cursor-pointer" />}
                                    postId={post.id}
                                    isUpdate={true}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <Trash className="size-4 opacity-50 cursor-not-allowed" />
                            <Edit className="size-4 opacity-50 cursor-not-allowed" />
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-5">
                <div className="col-span-3 flex flex-col justify-between">
                    <p className="text-sm leading-relaxed">{post.content}</p>
                    <PostActions
                        postId={post.id}
                        initialLiked={post.isLiked}
                        initialLikeCount={post.likeCount}
                        initialCommentCount={post.commentCount}
                    />
                </div>
                {post.imageUrl && (
                    <div className="col-span-2 flex items-center justify-center">
                        <Image
                            src={post.imageUrl}
                            alt="Post image"
                            loading="lazy"
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
