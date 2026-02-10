import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* We removed the 'eslint' and 'typescript' blocks because they
    sometimes cause validation errors in Dev mode. 
    (They are only needed when you deploy to AWS).
  */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  /* We removed 'experimental: { forceSwcTransforms: true }' 
    because it conflicts with the new Turbopack engine.
  */
};

export default nextConfig;