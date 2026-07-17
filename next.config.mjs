/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'usersdtgevlmimfoxajg.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
};

export default nextConfig;
