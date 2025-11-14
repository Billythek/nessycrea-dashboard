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
}

module.exports = nextConfig
