import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Add assetPrefix for production
    assetPrefix: process.env.NODE_ENV === 'production' ? '/your-base-path' : '',
    // Disable image optimization in production
    output: 'standalone',
};

export default nextConfig;
