'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    HomeIcon,
    MessageSquareIcon,
    BellIcon,
    UserRoundIcon,
    Pencil,
    LogOut,
    UsersIcon,
    Ratio,
} from 'lucide-react'
import { PostModal } from '@/components/modal/PostModal'
import { useUser } from '@/hooks/useUser'
import { signout } from '@/lib/actions/auth.action'
import { toast } from 'sonner'

export default function AppSidebar() {
    const { user } = useUser()

    const handleLogout = async () => {
        const res = await signout()
        if (!res.success) {
            toast.error('Logout failed', {
                description: 'Unable to sign out. Please try again.',
            })
            return
        }
        toast.success('Logged out successfully', {
            description: 'You have been signed out. See you next time!',
        })
    }

    return (
        <div className="w-56 flex flex-col justify-between border-r">
            <div className="p-4 border-b">
                <h4 className="flex items-center gap-2">
                    <Ratio /> Social App
                </h4>
            </div>
            <ul className="space-y-0 p-4">
                {[
                    {
                        icon: HomeIcon,
                        label: 'Home',
                        href: '/feed',
                    },
                    {
                        icon: MessageSquareIcon,
                        label: 'Messages',
                        href: '/feed',
                    },
                    {
                        icon: BellIcon,
                        label: 'Notifications',
                        href: '/feed',
                    },
                    {
                        icon: UsersIcon,
                        label: 'User Management',
                        href: '/users',
                    },
                ].map((item, idx) => {
                    if (idx > 2 && user?.role !== 'ADMIN') return null
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center text-light-100 hover:text-primary-200 transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-accent/50">
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.label}
                        </Link>
                    )
                })}
            </ul>
            <div className="space-y-2 p-4">
                <PostModal
                    trigger={
                        <Button
                            type="button"
                            variant="default"
                            className="w-full">
                            <Pencil />
                            Create Post
                        </Button>
                    }
                />
                <Link href={user ? `/profile/${user?.id}` : '/profile/me'}>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-background hover:bg-accent border-border text-light-100 transition-all duration-200 hover:scale-105">
                        <UserRoundIcon />
                        Profile
                    </Button>
                </Link>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full mt-2">
                    Logout
                    <LogOut />
                </Button>
            </div>
        </div>
    )
}
