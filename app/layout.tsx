import type { Metadata } from 'next'
import { Cairo, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Cairo is a high-quality Arabic display font that also covers Latin
// characters, so we can use it as the single sans face for the whole UI.
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'سباق الخيول العربي · Arab Horse Race',
  description:
    'لعبة سباق خيول تفاعلية للبث المباشر — التعليقات والهدايا تتحكم في تقدم 22 دولة عربية.',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#B6771D',
  width: 1200,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
