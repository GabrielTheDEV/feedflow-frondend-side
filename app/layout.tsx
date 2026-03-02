import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'


export const metadata: Metadata = {
  title: 'FeedFlow - AI-Powered Bug Reporting',
  description:
    'Capture bugs with AI-powered analysis, automatic severity classification, and instant Slack notifications. The modern way to handle user feedback.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366F1"><rect width="24" height="24" rx="6" fill="%236366F1"/><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="8" y1="9" x2="16" y2="9" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="13" x2="14" y2="13" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#8B5CF6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <script
          src="http://localhost:8000/static/widget.js"
          data-api-token="sI9cef_nRjUPi1zrI2tWs-8Kv2GrhZqvgndHF7fzgfw"
          data-api-url="http://localhost:8000/api/v1"
          data-domain="http://localhost:3000"
          data-button-text="Report Bug"
          data-button-position="bottom-right"
          data-primary-color="#4F46E5"
        />
        
      </body>
    </html>
  )
}
