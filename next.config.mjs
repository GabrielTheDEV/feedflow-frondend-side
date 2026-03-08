/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  httpAgentOptions: {
    keepAlive: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:8000/static/widget.js https://accounts.google.com https://*.supabase.co https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' http://localhost:8000 http://localhost:8000/static/widget.js https://*.supabase.co https://accounts.google.com https://*.google.com wss://*.supabase.co",
              "frame-src 'self' https://accounts.google.com",
              "frame-ancestors 'self'",
              "form-action 'self' https://accounts.google.com",
              "base-uri 'self'",
              "object-src 'none'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
