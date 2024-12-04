/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["*", "www.frapapa.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.raimax.bet",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "sports.api.sportsbookengine.com",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
