/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['wbjmrkeoeegvbvgffhda.supabase.co'],
  },
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/site',
        destination: '/site/index.html',
      },
      {
        source: '/site/',
        destination: '/site/index.html',
      },
    ]
  },
}

module.exports = nextConfig
