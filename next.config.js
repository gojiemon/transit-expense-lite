/** @type {import('next').NextConfig} */
const repoBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Do NOT set basePath for GitHub Pages project sites.
  // Keep index.html at root of the artifact, but prefix static assets.
  assetPrefix: repoBasePath || undefined,
  images: { unoptimized: true },
};

module.exports = nextConfig;
