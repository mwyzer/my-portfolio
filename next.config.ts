import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },

  // Tree-shake icon libraries — lucide-react is in Next.js's built-in
  // optimizePackageImports list, so barrel imports get rewritten to direct
  // subpath imports.  Cuts ~60 KiB of unused icon JavaScript.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Prevent unnecessary redirects that add latency to first request
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

export default nextConfig;
