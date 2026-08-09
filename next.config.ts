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
      {
        protocol: "https",
        hostname: "gitlab.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
    ],
  },

  // Security headers applied to all routes
  async headers() {
    // script-src/style-src need 'unsafe-inline' because: Next.js App Router
    // streams RSC payloads via inline <script> tags on every page, and this
    // app sets colors/layout through inline `style={{...}}` props throughout.
    // A nonce-based CSP would let us drop 'unsafe-inline' from script-src,
    // but that requires generating a per-request nonce in middleware and
    // widening its route matcher to run on every page (currently scoped to
    // /dashboard, /api/agent, /api/settings to avoid the extra Supabase
    // session-refresh latency on public pages) — a larger, separate change.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.supabase.co https://*.githubusercontent.com https://gitlab.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
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
