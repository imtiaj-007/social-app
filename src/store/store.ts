import { create } from 'zustand'
import { userSlice, type UserSlice } from './slices/userSlice'

export type StoreState = UserSlice

export const useStore = create<StoreState>()((...a) => ({
    ...userSlice(...a),
}))
