/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for better Amplify compatibility
  output: 'standalone',

  // Disable image optimization for static hosting
  images: {
    unoptimized: true
  },

  // Handle trailing slashes
  trailingSlash: true,
}

module.exports = nextConfig