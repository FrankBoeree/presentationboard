/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001", "*.netlify.app"]
    }
  },
  // Optimize for production
  swcMinify: true
}

module.exports = nextConfig
