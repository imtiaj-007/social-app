'use client'

import { useCallback } from 'react'
import { useStore as useAppStore } from '@/store/store'

export function usePosts() {
    const likes = useAppStore(state => state.likes || {})
    const getCachedLike = useAppStore(state => state.getCachedLike)
    const setCachedLike = useAppStore(state => state.setCachedLike)
    const invalidateLike = useAppStore(state => state.invalidateLike)

    const getPostLikeStatus = useCallback(
        (postId: string) => {
            if (!getCachedLike || typeof getCachedLike !== 'function') {
                return null
            }
            return getCachedLike(postId)
        },
        [getCachedLike]
    )

    const updatePostLikeStatus = useCallback(
        (postId: string, liked: boolean, likeCount?: number) => {
            if (!setCachedLike || typeof setCachedLike !== 'function') {
                return
            }
            setCachedLike(postId, { liked, likeCount })
        },
        [setCachedLike]
    )

    const clearPostLikeStatus = useCallback(
        (postId: string) => {
            if (!invalidateLike || typeof invalidateLike !== 'function') {
                return
            }
            invalidateLike(postId)
        },
        [invalidateLike]
    )

    return {
        likes,
        getPostLikeStatus,
        updatePostLikeStatus,
        clearPostLikeStatus,
    }
}
