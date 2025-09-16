import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js'
import { Database } from './database.types'

const options: SupabaseClientOptions<'public'> = {
    db: {
        schema: 'public',
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
    global: {
        headers: { 'x-application-name': 'social-app' },
    },
}

let supabase: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
    if (!supabase) {
        supabase = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            options
        )
    }
    return supabase
}
