import { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@/generated/prisma'
import { getCurrentUser } from '@/services/userService'

export interface UserSlice {
    user: Profile | null
    setUser: (user: Profile | null) => void
    clearUser: () => void
    isAuthenticated: () => boolean
    hasRole: (role: string) => boolean
    getFullName: () => string | null
    fetchAndSetCurrentUser: () => Promise<void>
}

export const userSlice: StateCreator<UserSlice, [], [['zustand/persist', UserSlice]]> = persist(
    (set, get) => ({
        user: null,
        setUser: user => set({ user }),
        clearUser: () => set({ user: null }),
        isAuthenticated: () => !!get().user,
        hasRole: (role: string) => get().user?.role === role,
        getFullName: () =>
            get().user ? `${get().user?.firstName} ${get().user?.lastName}`.trim() : null,
        fetchAndSetCurrentUser: async () => {
            const res = await getCurrentUser()
            if (res.success && res.data) set({ user: res.data as Profile })
        },
    }),
    { name: 'user-storage' }
)
