/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Allow images from any HTTPS source (be cautious in production)
      {
        protocol: 'https',
        hostname: '**',
      },
      // Allow local development
      {
        protocol: 'http',
        hostname: '192.168.18.250',
        port: '8000',
      },
    ],
    // Disable image optimization in development to prevent 404 errors
    ...(process.env.NODE_ENV === 'development' && {
      unoptimized: true,
    }),
  },
  // Configure CORS for development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  // Allow all origins in development
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
};

export default nextConfig;
