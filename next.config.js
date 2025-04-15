/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Allow both app directory and pages directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Ensure standalone output for production
  output: 'standalone',
  // Add image domains if needed
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig 