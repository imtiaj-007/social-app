import { StateCreator } from 'zustand'

type LikeEntry = { liked: boolean; likeCount?: number; ts: number }
const TTL_MS = 2 * 60 * 1000

export interface LikeSlice {
    likes: Record<string, LikeEntry>
    getCachedLike: (postId: string) => LikeEntry | null
    setCachedLike: (postId: string, entry: Omit<LikeEntry, 'ts'>) => void
    invalidateLike: (postId: string) => void
    clearAllLikes: () => void
}

export const likeSlice: StateCreator<LikeSlice> = (set, get) => ({
    likes: {},
    getCachedLike: postId => {
        const e = get().likes[postId]
        if (!e) return null
        if (Date.now() - e.ts > TTL_MS) return null
        return e
    },
    setCachedLike: (postId, entry) =>
        set(s => ({ likes: { ...s.likes, [postId]: { ...entry, ts: Date.now() } } })),
    invalidateLike: postId =>
        set(s => {
            const { [postId]: _, ...rest } = s.likes
            return { likes: rest }
        }),
    clearAllLikes: () => set({ likes: {} }),
})
