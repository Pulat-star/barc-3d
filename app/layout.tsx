import type { Metadata, Viewport } from 'next'
import { Manrope, Fraunces, DM_Mono, Montserrat, Cairo } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/ui/SmoothScroll'
import BackgroundLayer from '@/components/ui/BackgroundLayer'
import { LangProvider } from '@/components/ui/LangContext'

const sans = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--font-sans' })
const display = Fraunces({ subsets: ['latin'], weight: ['300', '400'], style: ['normal', 'italic'], variable: '--font-display' })
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })
const brand = Montserrat({ subsets: ['latin'], weight: ['800', '900'], variable: '--font-brand' })
const arabic = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '600', '700'], variable: '--font-ar' })

export const metadata: Metadata = {
  title: 'BÄRC — laundry care system',
  description:
    'BÄRC is a laundry care system: capsules, powder, gel and stain remover built on one formula platform.'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2E0A4F'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} ${brand.variable} ${arabic.variable}`}
    >
      <body className="font-sans">
        <LangProvider>
          <BackgroundLayer />
          <SmoothScroll />
          {children}
        </LangProvider>
      </body>
    </html>
  )
}
