/** @type {import('next').NextConfig} */
const repoBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: repoBasePath || undefined,
  assetPrefix: repoBasePath || undefined,
  images: { unoptimized: true },
};

module.exports = nextConfig;
