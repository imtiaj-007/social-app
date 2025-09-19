import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js'
import { Database } from './database.types'

const options: SupabaseClientOptions<'public'> = {
    db: {
        schema: 'public',
    },
    auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: true,
    },
    global: {
        headers: {
            'x-application-name': 'social-app',
        },
    },
}

export function createClient(): SupabaseClient<Database> {
    const supabaseURL: string = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabasePublishableKey: string = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

    return createBrowserClient<Database>(supabaseURL, supabasePublishableKey, options)
}
