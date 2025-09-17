import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Facebook } from 'lucide-react'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/auth/sign-in')
    }

    return (
        <div className="flex mx-auto max-w-7xl flex-col gap-12 my-12 px-16 max-sm:px-4 max-sm:my-8">
            <nav>
                <Link
                    href="/"
                    className="flex items-center gap-2">
                    <span className="size-8 rounded-xl bg-neutral-800 flex">
                        <Facebook className="size-5 m-auto" />
                    </span>
                    <h2 className="text-xl font-medium text-primary-100">Social App</h2>
                </Link>
            </nav>

            {children}
        </div>
    )
}
