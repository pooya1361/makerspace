/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Amplify
  output: 'export',

  // Disable image optimization for static export  
  images: {
    unoptimized: true
  },

  // Handle trailing slashes
  trailingSlash: true,

  // Disable server-side features that don't work with export
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig