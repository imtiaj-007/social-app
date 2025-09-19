import PostCard from '@/components/PostCard'
import CommentCard from '@/components/CommentCard'
import { getPostById } from '@/services/postService'

interface PostDetailsPageProps {
    params: Promise<{ post_id: string }>
}

export default async function PostDetailsPage({ params }: PostDetailsPageProps) {
    const { post_id } = await params
    const { data: post, success } = await getPostById(post_id)

    if (!success || !post) {
        return <div className="p-4 text-center">Post not found</div>
    }

    return (
        <div className="space-y-0">
            <div className="p-4 border-b">
                <h4 className="text-center">
                    Post: <span className="text-sm">{post_id}</span>
                </h4>
            </div>
            <div className="p-4 space-y-4">
                <PostCard
                    post={{
                        ...post,
                        isLiked: post.likes.some(like => like.userId === post.authorId),
                    }}
                    isCurrentUserPost={false}
                    isAdmin={post.author.role === 'ADMIN'}
                    showView={false}
                />
                <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-4">
                        Comments ({post.comments.length})
                    </h4>
                    {post.comments.length > 0 ? (
                        <div className="space-y-3">
                            {post.comments.map(comment => (
                                <CommentCard
                                    key={comment.id}
                                    comment={comment}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
