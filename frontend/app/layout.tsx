import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'REDTAPE — AI Legal Assistant',
  description: 'Cut through the red tape. Analyze contracts and generate legal notices with AI. Fast, accurate, and professional.',
  keywords: ['legal notice', 'contract analysis', 'AI legal', 'India legal', 'PDF analysis'],
  openGraph: {
    title: 'REDTAPE — AI Legal Assistant',
    description: 'Cut through the red tape. AI-powered contract analysis and legal notice generation for Indian citizens.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Swiss: no dark mode — strictly monochrome light */}
      <body className={`${inter.variable} font-sans antialiased bg-white text-black swiss-noise relative`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
