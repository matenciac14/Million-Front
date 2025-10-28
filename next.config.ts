import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7007',
        pathname: '/**',
      },
    ],
  },
  // Variables de entorno para desarrollo con SSL
  env: {
    NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_ENV === 'development' ? '0' : '1',
  },
};

export default nextConfig;
