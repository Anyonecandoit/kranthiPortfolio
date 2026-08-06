/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // `ws` (used by the Edge-TTS WebSocket) breaks when bundled by Next — run it from node_modules.
  experimental: {
    serverComponentsExternalPackages: ["ws"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
