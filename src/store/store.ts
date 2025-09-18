import { create } from 'zustand'
import { userSlice, type UserSlice } from './slices/userSlice'
import { likeSlice, type LikeSlice } from './slices/likeSlice'

export type StoreState = UserSlice & LikeSlice

export const useStore = create<StoreState>()((...a) => ({
    ...userSlice(...a),
    ...likeSlice(...a),
}))
