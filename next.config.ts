import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'nrfccqgmihnzipyflgzp.supabase.co' },
            { hostname: 'github.com' },
        ],
    },
}

export default nextConfig
