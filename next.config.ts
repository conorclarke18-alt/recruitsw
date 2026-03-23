import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/recruitsw",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
