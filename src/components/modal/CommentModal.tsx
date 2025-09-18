'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createComment } from '@/services/postService'
import { useUser } from '@/hooks/useUser'

interface CommentModalProps {
    trigger: React.ReactNode
    postId: string
    onCommentAdded?: () => void
}

export function CommentModal({ trigger, postId, onCommentAdded }: CommentModalProps) {
    const [open, setOpen] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [busy, setBusy] = useState(false)
    const { isAuthenticated } = useUser()

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to comment')
            return
        }
        if (!commentText.trim() || busy) return

        setBusy(true)
        const text = commentText.trim()

        const res = await createComment(postId, text)
        if (res.success) {
            toast.success('Comment added successfully')
            setCommentText('')
            setOpen(false)
            onCommentAdded?.()
        } else {
            toast.error('Failed to add comment')
        }

        setBusy(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a Comment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Write your comment..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleSubmit()
                        }}
                        disabled={busy}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={busy}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={busy || !commentText.trim()}>
                            {busy ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
