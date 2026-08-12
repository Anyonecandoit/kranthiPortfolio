/** @type {import('next').NextConfig} */

// The mobile (Capacitor) build produces a static export: server API routes are
// moved aside by scripts/build-mobile.sh, and the app calls the deployed
// backend instead (see lib/api.ts).
const isMobileBuild = process.env.MOBILE_BUILD === "1";

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
  ...(isMobileBuild
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {
        // The bundled Capacitor app loads the site from a local WebView origin
        // (https://localhost / capacitor://localhost) but calls the deployed
        // /api/* routes cross-origin, so those routes must allow CORS.
        async headers() {
          return [
            {
              source: "/api/:path*",
              headers: [
                { key: "Access-Control-Allow-Origin", value: "*" },
                { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
                { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
              ],
            },
          ];
        },
      }),
};

module.exports = nextConfig;
