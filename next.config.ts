import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bkkdripxsfnausbwqpsl.supabase.co",
      },
    ],
  },
};

export default nextConfig;
