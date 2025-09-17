'use client'

import { z } from 'zod'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/form/FormField'
import { login, signup } from '@/lib/actions/auth.action'
import { registerUser } from '@/services/userService'
import { CreateUser } from '@/types/user'
import { useRouter } from 'next/navigation'

type FormType = 'sign-in' | 'sign-up'

const authFormSchema = (type: FormType) => {
    const baseSchema = {
        email: z.email('Email is required'),
        password: z.string().min(8, 'Password should be at least 8 characters'),
        username:
            type === 'sign-up'
                ? z
                      .string()
                      .min(3, 'Username must be at least 3 characters')
                      .max(30, 'Username cannot exceed 30 characters')
                      .regex(
                          /^[a-zA-Z0-9_]+$/,
                          'Username can only contain letters, numbers, and underscores'
                      )
                : z.string().optional(),
        firstName:
            type === 'sign-up'
                ? z.string().min(2, 'First name is required')
                : z.string().optional(),
        lastName:
            type === 'sign-up' ? z.string().min(2, 'Last name is required') : z.string().optional(),
    }
    return z.object(baseSchema)
}

interface AuthFormProps {
    type: FormType
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
    const router = useRouter()
    const formSchema = authFormSchema(type)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)

            if (type === 'sign-up') {
                const user = await signup(formData)
                if (!user) {
                    toast.error('Registration failed', {
                        description: 'Unable to create your account. Please try again.',
                    })
                    return
                }
                const { password, ...dataWithoutPassword } = data
                const payload: CreateUser = { ...dataWithoutPassword, id: user?.id } as CreateUser

                const res = await registerUser(payload)
                if (!res.success) {
                    toast.error('Profile creation failed', {
                        description:
                            'Account created but profile setup failed. Please contact support.',
                    })
                    return
                }
                toast.success('Registration complete!', {
                    description:
                        'Please check your email for the verification link to activate your account.',
                })
                router.push('/auth/sign-in')
            } else {
                await login(formData)
                toast.success('Welcome back!', {
                    description: 'You have successfully signed in to your account.',
                })
                router.push('/')
            }
        } catch (error) {
            toast.error('Authentication error', {
                description:
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred. Please try again.',
            })
        }
    }

    const isSignIn = type === 'sign-in'

    return (
        <div className="card-border lg:min-w-[700px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <h2 className="text-primary-100">Social App</h2>
                <h3>Connect with your loved ones</h3>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full grid grid-cols-2 gap-6 mt-4 form">
                        {!isSignIn && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    label="First Name"
                                    placeholder="Your First Name"
                                    type="text"
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    label="Last Name"
                                    placeholder="Your Last Name"
                                    type="text"
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    label="Username"
                                    placeholder="Your Username"
                                    type="text"
                                />
                            </>
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your email address"
                            type="email"
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />

                        <Button
                            className="btn col-span-2"
                            type="submit">
                            {isSignIn ? 'Sign In' : 'Create an Account'}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? 'No account yet?' : 'Have an account already?'}
                    <Link
                        href={!isSignIn ? '/auth/sign-in' : '/auth/sign-up'}
                        className="font-bold text-user-primary ml-1">
                        {!isSignIn ? 'Sign In' : 'Sign Up'}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm
