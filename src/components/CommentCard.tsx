import { getUserById } from '@/services/userService'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Edit, Trash } from 'lucide-react'

interface CommentCardProps {
    comment: {
        id: string
        content: string
        createdAt: Date
        authorId: string
    }
}

export default async function CommentCard({ comment }: CommentCardProps) {
    const { data: author, success } = await getUserById(comment.authorId)

    if (!success || !author) {
        return null
    }

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

    return (
        <div
            key={comment.id}
            className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={author.avatarUrl || ''}
                        alt={author.username}
                    />
                    <AvatarFallback>
                        {getInitials(author.firstName, author.lastName, author.username)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                            {author.firstName} {author.lastName}
                        </span>
                        {author.role === 'ADMIN' && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                Admin
                            </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100" />
                    <Trash className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100" />
                </div>
            </div>
        </div>
    )
}
