import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'idleclansfinder.vercel.app',
            },
        ],
    },
};

export default nextConfig;
