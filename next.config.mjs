/**
 * Static export so the app can be hosted on GitHub Pages.
 * basePath/assetPrefix are set for project pages served under
 * /foodloop-rebuild/. Override with BASE_PATH="" for local/root hosting.
 */
const basePath = process.env.BASE_PATH ?? "/foodloop-rebuild";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
