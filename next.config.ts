import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com', 'firebasestorage.googleapis.com','upload.wikimedia.org'],
  },
  /* otras opciones de configuración si las hay */
};

export default nextConfig;
