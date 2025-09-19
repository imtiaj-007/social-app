'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CommentModal } from '@/components/modal/CommentModal'
import { likePost, unlikePost } from '@/services/postService'
import { MessageCircle, Share2, ThumbsUp } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { usePosts } from '@/hooks/usePosts'

type PostActionsProps = {
    postId: string
    initialLiked?: boolean
    initialLikeCount?: number
    initialCommentCount?: number
    onCountsChange?: (next: { likeCount: number; commentCount: number; liked: boolean }) => void
    shareUrl?: string
}

export function PostActions({
    postId,
    initialLiked = false,
    initialLikeCount = 0,
    initialCommentCount = 0,
    onCountsChange,
    shareUrl,
}: PostActionsProps) {
    const { isAuthenticated } = useUser()
    const { updatePostLikeStatus } = usePosts()
    const [liked, setLiked] = useState<boolean>(initialLiked)
    const [likeCount, setLikeCount] = useState<number>(initialLikeCount)
    const [commentCount, setCommentCount] = useState<number>(initialCommentCount)
    const [busy, setBusy] = useState<boolean>(false)

    const emitCounts = (next: { likeCount: number; commentCount: number; liked: boolean }) => {
        onCountsChange?.(next)
    }

    const toggleLike = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to like')
            return
        }
        if (busy) return
        setBusy(true)

        // optimistic
        const prev = { liked, likeCount }
        const nextLiked = !liked
        const nextLikeCount = Math.max(0, likeCount + (nextLiked ? 1 : -1))
        setLiked(nextLiked)
        setLikeCount(nextLikeCount)
        emitCounts({ likeCount: nextLikeCount, commentCount, liked: nextLiked })
        updatePostLikeStatus(postId, nextLiked, nextLikeCount)

        const res = nextLiked ? await likePost(postId) : await unlikePost(postId)
        if (!res.success) {
            // revert on failure
            setLiked(prev.liked)
            setLikeCount(prev.likeCount)
            emitCounts({ likeCount: prev.likeCount, commentCount, liked: prev.liked })
            updatePostLikeStatus(postId, prev.liked, prev.likeCount)
            toast.error('Failed to update like')
        }

        setBusy(false)
    }

    const handleCommentAdded = () => {
        const nextCount = commentCount + 1
        setCommentCount(nextCount)
        emitCounts({ likeCount, commentCount: nextCount, liked })
        toast.success('Comment added')
    }

    const share = async () => {
        const url = shareUrl || `${window.location.origin}/posts/${postId}`
        try {
            if (navigator.share) {
                await navigator.share({ url })
            } else {
                await navigator.clipboard.writeText(url)
                toast.success('Link copied')
            }
        } catch {
            toast.error('Could not share')
        }
    }

    return (
        <div className="flex items-center gap-3 pt-2">
            <Button
                variant={liked ? 'default' : 'outline'}
                size="sm"
                className="w-24"
                onClick={toggleLike}
                disabled={busy}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                {likeCount}
            </Button>

            <CommentModal
                trigger={
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-24"
                        disabled={busy}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {commentCount}
                    </Button>
                }
                postId={postId}
                onCommentAdded={handleCommentAdded}
            />

            <Button
                variant="outline"
                size="sm"
                className="w-24"
                onClick={share}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
            </Button>
        </div>
    )
}
