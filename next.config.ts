import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "mongodb",
    "@mongodb-js/saslprep",
    "kerberos",
    "snappy",
    "@aws-sdk/credential-providers",
    "mongodb-client-encryption",
    "socks",
    "bcryptjs",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
