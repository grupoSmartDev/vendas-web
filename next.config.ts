// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚠️ TEMPORÁRIO - Desabilita ESLint no build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ⚠️ TEMPORÁRIO - Desabilita TypeScript strict no build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;