import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/upload", destination: "/tool" }];
  },
};

export default nextConfig;
