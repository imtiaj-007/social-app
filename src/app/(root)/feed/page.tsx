import { Suspense } from 'react'
import PostsFeed from '@/components/PostsFeed'
import type { PostWithAuthor } from '@/types/post'

async function fetchInitialPosts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts?limit=10`, {
        cache: 'no-store',
    })
    const json = await res.json()
    return json as { success: boolean; data: PostWithAuthor[]; nextCursor: string | null }
}

export default async function FeedPage() {
    const { data, nextCursor } = await fetchInitialPosts()
    return (
        <Suspense fallback={null}>
            {/* Client component for infinite loading */}
            <PostsFeed
                initialItems={data}
                initialCursor={nextCursor}
            />
        </Suspense>
    )
}
