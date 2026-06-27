/** @type {import('next').NextConfig} */
const nextConfig = {
 serverExternalPackages: ['...']
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
