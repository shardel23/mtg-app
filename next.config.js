/** @type {import('next').NextConfig} */
const nextConfig = {
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
  reactStrictMode: false,
};

const { withAxiom } = require('next-axiom');

module.exports = withAxiom(nextConfig);
