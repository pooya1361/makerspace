/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Amplify
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true
  },

  // Handle trailing slashes
  trailingSlash: true,

  // Base path (leave empty for root deployment)
  basePath: '',

  // Asset prefix (leave empty for default)
  assetPrefix: '',
}

module.exports = nextConfig