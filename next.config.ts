import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    ignoreDuringBuilds: true, // 在构建时忽略 ESLint
  },


};

export default nextConfig;
