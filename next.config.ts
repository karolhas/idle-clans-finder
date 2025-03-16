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
    // Disable image optimization in production
    output: 'standalone',
};

export default nextConfig;
