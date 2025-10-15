/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  // Server Actions are enabled by default in Next.js 14
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001", "*.netlify.app"]
    }
  },
  // Optimize for production
  swcMinify: true,
  // Fix webpack path resolution
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add path aliases for webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
    }
    
    return config
  }
}

module.exports = nextConfig
