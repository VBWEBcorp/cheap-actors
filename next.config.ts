import type { NextConfig } from "next";

/**
 * BUILD_STATIC=1 swaps the config to produce a fully static export
 * (no server, no middleware, no API routes) for GitHub Pages.
 * The build script in scripts/build-static.mjs first temporarily
 * moves all server-only routes out of /src before invoking next build.
 */
const STATIC_EXPORT = process.env.BUILD_STATIC === "1";
const BASE_PATH = process.env.STATIC_BASE_PATH ?? "/cheap-actors";

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
  images: STATIC_EXPORT
    ? { unoptimized: true }
    : {
        remotePatterns: [
          { protocol: "https", hostname: "img.youtube.com" },
          { protocol: "https", hostname: "i.ytimg.com" },
          { protocol: "https", hostname: "images.unsplash.com" },
        ],
      },
  ...(STATIC_EXPORT
    ? {
        output: "export" as const,
        basePath: BASE_PATH,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
