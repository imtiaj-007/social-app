'use client'

import { useEffect, useRef, useState } from 'react'
import PostCard from '@/components/PostCard'
import { useUser } from '@/hooks/useUser'
import { PostWithAuthor } from '@/types/post'

export default function PostsFeed({
    initialItems,
    initialCursor,
}: {
    initialItems: PostWithAuthor[]
    initialCursor: string | null
}) {
    const [items, setItems] = useState<PostWithAuthor[]>(initialItems)
    const [cursor, setCursor] = useState<string | null>(initialCursor)
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(!initialCursor)
    const sentinelRef = useRef<HTMLDivElement | null>(null)
    const { user } = useUser()

    const handlePostDeleted = () => {
        // Refresh the feed by resetting to initial state and fetching from beginning
        setItems(initialItems)
        setCursor(initialCursor)
        setDone(!initialCursor)
    }

    useEffect(() => {
        if (!sentinelRef.current || done || loading) return
        const el = sentinelRef.current
        const io = new IntersectionObserver(
            async ([entry]) => {
                if (!entry.isIntersecting || loading || done) return
                setLoading(true)
                const params = new URLSearchParams()
                params.set('limit', '10')
                if (cursor) params.set('cursor', cursor)
                const res = await fetch(`/api/posts?${params.toString()}`, { cache: 'no-store' })
                const json = (await res.json()) as {
                    success: boolean
                    data: PostWithAuthor[]
                    nextCursor: string | null
                }
                setItems(prev => [...prev, ...json.data])
                setCursor(json.nextCursor)
                setDone(!json.nextCursor)
                setLoading(false)
            },
            { rootMargin: '200px' }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [cursor, done, loading])

    return (
        <div className="space-y-0">
            <div className="border-b p-4">
                <h4 className="text-center">Public Feed</h4>
            </div>
            <div className="p-4 space-y-4">
                {items.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onPostDeleted={handlePostDeleted}
                        isCurrentUserPost={user?.id === post.author?.id}
                        isAdmin={user?.role === 'ADMIN'}
                    />
                ))}
                {!done && (
                    <div
                        ref={sentinelRef}
                        className="h-10"
                    />
                )}
                {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
                {done && items.length === 0 && <p className="text-center">No posts yet.</p>}
            </div>
        </div>
    )
}
