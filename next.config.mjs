/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ai-chats',
        permanent: true, // Set to false if you want a temporary redirect
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.exfiles.trootechproducts.com',
        pathname: '/media/icons/**',
      },
    ],
  },
};

export default nextConfig;
