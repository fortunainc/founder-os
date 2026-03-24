import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Full Next.js mode for Vercel deployment
  // Remove 'output: export' to enable server-side rendering and full features
  images: {
    // Vercel handles image optimization automatically
  },
};

export default nextConfig;
