import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains:["cdn.sanity.io"],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during builds
  },
};

export default nextConfig;
