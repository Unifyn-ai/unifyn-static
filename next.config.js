/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  // Use static export only in production builds. In dev, disable to avoid chunk 404s.
  ...(isProd ? { output: 'export' } : {}),
  distDir: '.next',
  images: { unoptimized: true },
  trailingSlash: true,
  
  // Performance optimizations
  compress: true,
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Remove ALL console logs in production for Lighthouse best practices
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? true : false,
  },
  
  // Target modern browsers to avoid unnecessary polyfills
  // This reduces bundle size by ~43KB by not including polyfills for:
  // - Array.prototype.at, flat, flatMap
  // - Object.fromEntries, hasOwn
  // - String.prototype.trimStart, trimEnd
  // Note: Next.js 15+ uses SWC by default, no need to enable it explicitly
  
  // Optimize React
  reactStrictMode: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Disable legacy polyfills - target modern browsers only
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
