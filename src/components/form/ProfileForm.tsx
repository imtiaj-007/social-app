'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/form/FormField'
import { getCurrentUser, updateCurrentUser } from '@/services/userService'
import { saveImageToStorage } from '@/lib/actions/storage.action'
import { ChevronLeft } from 'lucide-react'
import { updateProfileSchema, type UpdateUser } from '@/types/user'
import type { Profile } from '@/generated/prisma'

export const ProfileForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    const form = useForm<UpdateUser>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            bio: '',
            website: '',
            location: '',
            avatarUrl: '',
        },
        mode: 'onBlur',
    })

    // Use react-hook-form's built-in dirty state tracking
    const {
        formState: { isDirty },
    } = form

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getCurrentUser()
                const userData = response.data as Profile
                const formData = {
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    bio: userData.bio || '',
                    website: userData.website || '',
                    location: userData.location || '',
                    avatarUrl: userData.avatarUrl || '',
                }
                form.reset(formData)

                if (userData.avatarUrl) {
                    setAvatarPreview(userData.avatarUrl)
                }
            } catch (error) {
                toast.error('Error loading profile')
            }
        }

        fetchUserData()
    }, [form])

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
            const uploadResult = await saveImageToStorage(file, 'profile', 'avatars')

            if (uploadResult.success && uploadResult.data) {
                const newAvatarUrl = uploadResult.data.url
                form.setValue('avatarUrl', newAvatarUrl, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                })
                setAvatarPreview(newAvatarUrl)
                toast.success('Avatar uploaded successfully')
            } else {
                toast.error('Failed to upload avatar')
            }
        } catch (error) {
            toast.error('Error uploading avatar')
        } finally {
            setIsUploading(false)
            event.target.value = ''
        }
    }

    const onSubmit = async (data: UpdateUser) => {
        setIsLoading(true)
        try {
            const response = await updateCurrentUser(data)

            if (response.success) {
                toast.success('Profile updated successfully')
                form.reset(data)
            } else {
                toast.error('Failed to update profile')
            }
        } catch (error) {
            toast.error('Error updating profile')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}>
                <ChevronLeft />
                Go Back
            </Button>

            <div className="max-w-4xl mx-auto p-6 grid grid-cols-6 gap-6">
                <div className="col-span-2">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex-shrink-0">
                            <Image
                                src={avatarPreview || 'https://github.com/evilrabbit.png'}
                                alt="Current avatar"
                                width={300}
                                height={300}
                                className="w-64 h-64 rounded-full object-cover"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Upload New Avatar
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={handleAvatarUpload}
                                disabled={isUploading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {isUploading && (
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
                    <h1 className="text-3xl font-bold mb-8">Profile</h1>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    label="First Name"
                                    type="input"
                                    placeholder="Enter your first name"
                                    disabled
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    label="Last Name"
                                    type="input"
                                    placeholder="Enter your last name"
                                    disabled
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                label="Email"
                                type="input"
                                inputType="email"
                                placeholder="Enter your email"
                                disabled
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                label="Bio"
                                type="textarea"
                                placeholder="Tell us about yourself"
                            />

                            <FormField
                                control={form.control}
                                name="website"
                                label="Website"
                                type="input"
                                placeholder="https://yourwebsite.com"
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                label="Location"
                                type="input"
                                placeholder="Enter your location"
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!isDirty || isLoading}>
                                {isLoading ? 'Updating...' : 'Update Profile'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
