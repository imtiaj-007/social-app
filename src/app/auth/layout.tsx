import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex mx-auto max-w-7xl items-center justify-center">
            {children}
        </div>
    )
}
