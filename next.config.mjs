/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // serverExternalPackages tells Next.js 15 to keep these out of the webpack bundle —
  // this is sufficient for Prisma with pnpm; the monorepo-workaround-plugin is NOT
  // needed here since the schema lives in this same package.
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg', 'prisma'],
}

export default nextConfig
