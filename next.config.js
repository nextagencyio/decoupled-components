/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['decoupled-client'],
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
