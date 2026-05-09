import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'سباق الخيول العربي · Arab Horse Race',
  description:
    'لعبة سباق خيول تفاعلية للبث المباشر — التعليقات والهدايا تتحكم في تقدم 22 دولة عربية.',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#1a0e05',
  width: 1400,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
