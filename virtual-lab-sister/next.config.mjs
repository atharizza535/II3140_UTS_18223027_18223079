/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ replaces "next export"
  distDir: 'out',   // ✅ export output folder
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
