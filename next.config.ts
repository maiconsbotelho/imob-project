import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lnaemndkgfpmoevhszbz.supabase.co",
      },
    ],
  },
};

export default nextConfig;
