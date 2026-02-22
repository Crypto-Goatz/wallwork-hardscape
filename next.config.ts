import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["googleapis", "google-auth-library"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Allow images from imported sites (any HTTPS host)
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
