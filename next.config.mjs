/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid ChunkLoadError when the first dev compile is slow on large bundles.
      config.output.chunkLoadTimeout = 120000;
    }
    return config;
  },
};

export default nextConfig;
