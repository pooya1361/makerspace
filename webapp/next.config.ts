/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for Amplify compatibility
  images: {
    unoptimized: true
  },

  // Handle trailing slashes
  trailingSlash: true,
}

module.exports = nextConfig