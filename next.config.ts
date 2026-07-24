import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [
      {
        // Not content-hashed — filenames get swapped in place during
        // rebrands (see README), so a shorter cache + revalidate window is
        // used instead of a full year/immutable.
        source: "/cm2/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
