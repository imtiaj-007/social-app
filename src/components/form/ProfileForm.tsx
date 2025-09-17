'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Image from 'next/image'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/form/FormField'
import { getCurrentUser, updateCurrentUser } from '@/services/userService'
import { saveImageToStorage } from '@/lib/actions/storage.action'
import type { UpdateUser } from '@/types/user'
import type { Profile } from '@/generated/prisma'

const profileFormSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.email('Invalid email address'),
    bio: z.string().optional(),
    website: z.url('Invalid URL').or(z.literal('')).optional(),
    location: z.string().optional(),
    avatarUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export const ProfileForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [initialData, setInitialData] = useState<ProfileFormValues | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            bio: '',
            website: '',
            location: '',
            avatarUrl: '',
        },
    })

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
                setInitialData(formData)
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

        setIsUploading(true)
        try {
            const uploadResult = await saveImageToStorage(file, 'avatars')

            if (uploadResult.success && uploadResult.data) {
                const newAvatarUrl = uploadResult.data.url
                form.setValue('avatarUrl', newAvatarUrl, { shouldDirty: true })
                setAvatarPreview(newAvatarUrl)
                toast.success('Avatar uploaded successfully')
            } else {
                toast.error('Failed to upload avatar')
            }
        } catch (error) {
            toast.error('Error uploading avatar')
        } finally {
            setIsUploading(false)
            // Reset the file input
            event.target.value = ''
        }
    }

    const onSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true)
        try {
            const response = await updateCurrentUser(data as UpdateUser)

            if (response.success) {
                toast.success('Profile updated successfully')
                setInitialData(data)
            } else {
                toast.error('Failed to update profile')
            }
        } catch (error) {
            toast.error('Error updating profile')
        } finally {
            setIsLoading(false)
        }
    }

    const isFormDirty = () => {
        if (!initialData) return false
        const currentValues = form.getValues()
        return JSON.stringify(currentValues) !== JSON.stringify(initialData)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 grid grid-cols-6 gap-6">
            <div className="col-span-2">
                {avatarPreview && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex-shrink-0">
                            <Image
                                src={avatarPreview}
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
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isUploading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {isUploading && (
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                            )}
                        </div>
                    </div>
                )}
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
                                placeholder="Enter your first name"
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                label="Last Name"
                                placeholder="Enter your last name"
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            label="Bio"
                            placeholder="Tell us about yourself"
                        />

                        <FormField
                            control={form.control}
                            name="website"
                            label="Website"
                            placeholder="https://yourwebsite.com"
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            label="Location"
                            placeholder="Enter your location"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!isFormDirty() || isLoading}>
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
