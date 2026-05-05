import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.205.176.21:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
