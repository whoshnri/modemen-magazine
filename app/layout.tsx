import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'Modemen Mag | Fashion, Lifestyle & Culture',
  description: 'Premium editorial content featuring men\'s fashion, lifestyle, and high-end culture',
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: '#d4af37',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} font-sans antialiased bg-black-primary text-foreground`}>
        {children}
      </body>
    </html>
  )
}
