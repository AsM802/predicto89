import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['../../backend', '@magic-ext/oauth', 'magic-sdk', 'wagmi', 'class-variance-authority', 'clsx', 'nanoid'],
};

export default nextConfig;
