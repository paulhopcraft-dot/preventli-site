import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/:path*",
          destination: "https://app.preventli.ai/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
