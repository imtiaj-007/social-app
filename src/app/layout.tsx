import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const nunito = Nunito({
    variable: '--font-nunito',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Social App',
    description: 'An social media platform built using Next.js, React.js, TypeScript and Supabase',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            className="dark">
            <body className={`${nunito.className} antialiased pattern`}>
                {children}
                <Toaster />
            </body>
        </html>
    )
}
