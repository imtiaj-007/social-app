'use server'

import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

export async function login(formData: FormData): Promise<User | null> {
    const supabase = await createClient()

    const payload = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { data, error } = await supabase.auth.signInWithPassword(payload)

    if (error) {
        return null
    }
    return data.user
}

export async function signup(formData: FormData): Promise<User | null> {
    const supabase = await createClient()

    const payload = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { data, error } = await supabase.auth.signUp(payload)

    if (error) {
        return null
    }
    return data.user
}

export async function signout(): Promise<{ success: boolean }> {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { success: false }
    }
    return { success: true }
}
