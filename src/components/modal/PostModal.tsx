'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PostForm } from '@/components/form/PostForm'
import { createPost, getPostById, updatePost } from '@/services/postService'
import type { CreatePost, DetailedPost } from '@/types/post'

interface PostModalProps {
    trigger?: React.ReactNode
    onPostCreated?: () => void
    onPostUpdated?: () => void
    postId?: string
    isUpdate?: boolean
}

export function PostModal({
    trigger,
    onPostCreated,
    onPostUpdated,
    postId,
    isUpdate = false,
}: PostModalProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [postData, setPostData] = useState<DetailedPost | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (open && isUpdate && postId) {
            fetchPostData()
        }
    }, [open, isUpdate, postId])

    const fetchPostData = async () => {
        if (!postId) return

        setIsLoading(true)
        try {
            const result = await getPostById(postId)
            if (result.success && result.data) {
                setPostData(result.data)
            } else {
                toast.error('Failed to fetch post data')
            }
        } catch (error) {
            toast.error('Error fetching post data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreatePost = async (data: CreatePost) => {
        try {
            const result = await createPost(data)

            if (result.success) {
                setOpen(false)
                toast.success('Post created successfully!')
                if (onPostCreated) {
                    onPostCreated()
                }
            } else {
                toast.error('Failed to create post')
            }
        } catch (error) {
            toast.error('Error creating post')
        }
    }

    const handleUpdatePost = async (data: CreatePost) => {
        if (!postId) return

        try {
            const result = await updatePost(postId, data)

            if (result.success) {
                setOpen(false)
                toast.success('Post updated successfully!')
                if (onPostUpdated) {
                    onPostUpdated()
                }
            } else {
                toast.error('Failed to update post')
            }
        } catch (error) {
            toast.error('Error updating post')
        }
    }

    const handleSubmit = isUpdate ? handleUpdatePost : handleCreatePost

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="default"
                        size="sm">
                        {isUpdate ? 'Edit Post' : 'Create Post'}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Edit Post' : 'Create New Post'}</DialogTitle>
                    <DialogDescription>
                        {isUpdate
                            ? 'Update your post content, category, or image.'
                            : 'Share your thoughts, announcements, or questions with the community.'}
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <p>Loading post data...</p>
                    </div>
                ) : (
                    <PostForm
                        onSubmit={handleSubmit}
                        defaultValues={
                            postData
                                ? {
                                      content: postData.content,
                                      category: postData.category,
                                      imageUrl: postData.imageUrl || '',
                                  }
                                : undefined
                        }
                        isUpdate={isUpdate}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
