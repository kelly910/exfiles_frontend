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
        hostname: process.env.NEXT_PUBLIC_FETCH_TAG_IMAGES,
        pathname: process.env.NEXT_PUBLIC_IMAGE_PATHNAME,
      },
    ],
  },
};

export default nextConfig;
