/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for static hosting
  images: {
    unoptimized: true
  },

  // Handle trailing slashes
  trailingSlash: true,

  // Ensure static generation where possible
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./public/**/*'],
    },
  },
}

module.exports = nextConfig