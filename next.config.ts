import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rickandmortyapi.com",
        pathname: "/api/character/avatar/**",
      },
    ],
  },
  experimental: { cpus: 2, staticGenerationMaxConcurrency: 4 },
};
export default config;
