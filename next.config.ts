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
    async redirects() {
        return [
            {
                source: '/(.*)',
                destination: 'https://idleclanshub.vercel.app/:1',
                permanent: true,
                has: [
                    {
                        type: 'host',
                        value: 'idleclansfinder.vercel.app',
                    },
                ],
            },
            {
                source: '/(.*)',
                destination: 'https://idleclanshub.vercel.app/:1',
                permanent: true,
                has: [
                    {
                        type: 'host',
                        value: 'icfinder.vercel.app',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
