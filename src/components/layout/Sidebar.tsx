import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HomeIcon, MessageSquareIcon, BellIcon, UserRoundIcon, Pencil } from 'lucide-react'
import { PostModal } from '@/components/modal/PostModal'

export default function AppSidebar() {
    return (
        <div className="w-56 flex flex-col justify-between border-r p-4">
            <ul className="space-y-0.5">
                <li className="flex items-center text-light-100 hover:text-primary-200 transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-accent/50">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Home
                </li>
                <li className="flex items-center text-light-100 hover:text-primary-200 transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-accent/50">
                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                    Messages
                </li>
                <li className="flex items-center text-light-100 hover:text-primary-200 transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-accent/50">
                    <BellIcon className="w-4 h-4 mr-2" />
                    Notifications
                </li>
            </ul>
            <div className="space-y-2">
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
                <Link href="/profile">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-background hover:bg-accent border-border text-light-100 transition-all duration-200 hover:scale-105">
                        <UserRoundIcon />
                        Profile
                    </Button>
                </Link>
            </div>
        </div>
    )
}
