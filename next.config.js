/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Allow both app directory and pages directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Ensure standalone output for production
  output: 'standalone',
  // Add image domains if needed
  images: {
    domains: ['example.com', 'nzwwcituvkxkqvbiavcq.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Configure webpack to resolve alias @ to the src folder
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'), // Resolving @ to the src folder
    };
    return config;
  },
}

module.exports = nextConfig;
