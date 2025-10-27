/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed for dynamic server
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
