'use client'

import { useStore as useAppStore } from '@/store/store'
import type { Profile } from '@/generated/prisma'

export function useUser() {
    const user = useAppStore(state => state.user as Profile | null)
    const setUser = useAppStore(state => state.setUser)
    const clearUser = useAppStore(state => state.clearUser)
    const fetchAndSetCurrentUser = useAppStore(state => state.fetchAndSetCurrentUser)
    const hasRole = useAppStore(state => state.hasRole)

    const isAuthenticated = !!user
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : null

    return {
        user,
        setUser,
        clearUser,
        fetchAndSetCurrentUser,
        isAuthenticated,
        fullName,
        hasRole,
    }
}
