'use client'

import Image from 'next/image'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/form/FormField'
import { saveImageToStorage } from '@/lib/actions/storage.action'
import { createPostSchema, type CreatePost } from '@/types/post'

interface PostFormProps {
    onSubmit?: (data: CreatePost) => Promise<void> | void
    defaultValues?: Partial<CreatePost>
    isUpdate?: boolean
}

export const PostForm = ({
    onSubmit: onSubmitProp,
    defaultValues,
    isUpdate = false,
}: PostFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null)

    const form = useForm<CreatePost>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            content: '',
            category: 'GENERAL',
            imageUrl: '',
            ...defaultValues,
        },
        mode: 'onBlur',
    })

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be under 2MB')
            event.target.value = ''
            return
        }

        setIsUploading(true)
        try {
            const uploadResult = await saveImageToStorage(file, 'posts', 'avatars')

            if (uploadResult.success && uploadResult.data) {
                const newImageUrl = uploadResult.data.url
                form.setValue('imageUrl', newImageUrl, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                })
                setImagePreview(newImageUrl)
                toast.success('Image uploaded successfully')
            } else {
                toast.error('Failed to upload image')
            }
        } catch (error) {
            toast.error('Error uploading image')
        } finally {
            setIsUploading(false)
            event.target.value = ''
        }
    }

    const handleSubmit: SubmitHandler<CreatePost> = async data => {
        setIsLoading(true)
        try {
            if (onSubmitProp) {
                await onSubmitProp(data)
            }
            toast.success(`Post ${isUpdate ? 'updated' : 'created'} successfully!`)
            if (!isUpdate) {
                form.reset()
                setImagePreview(null)
            }
        } catch (error) {
            toast.error(`Error ${isUpdate ? 'updating' : 'creating'} post`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6">
                <FormField
                    control={form.control}
                    name="content"
                    type="textarea"
                    label="Content"
                    placeholder="What's on your mind?"
                    rows={5}
                    maxLength={280}
                    showCharacterCount={true}
                    resize={false}
                    required
                />

                <FormField
                    control={form.control}
                    name="category"
                    type="select"
                    label="Category"
                    placeholder="Select a category"
                    options={[
                        { value: 'GENERAL', label: 'General' },
                        { value: 'ANNOUNCEMENT', label: 'Announcement' },
                        { value: 'QUESTION', label: 'Question' },
                    ]}
                    required
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Image (optional)</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="w-full p-3 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {isUploading && (
                        <p className="text-sm text-muted-foreground">Uploading image...</p>
                    )}
                    {imagePreview && (
                        <div className="mt-2 w-full flex items-center justify-center">
                            <Image
                                src={imagePreview}
                                alt="Post preview"
                                width={200}
                                height={200}
                                className="h-48 w-auto object-cover rounded-md border"
                            />
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !form.formState.isValid}
                    className="w-full">
                    {isLoading
                        ? isUpdate
                            ? 'Updating...'
                            : 'Creating...'
                        : isUpdate
                          ? 'Update Post'
                          : 'Create Post'}
                </Button>
            </form>
        </Form>
    )
}
