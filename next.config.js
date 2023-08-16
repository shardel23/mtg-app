/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
