import type { Metadata, Viewport } from 'next'
import { Manrope, Fraunces, DM_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/ui/SmoothScroll'
import BackgroundLayer from '@/components/ui/BackgroundLayer'
import { LangProvider } from '@/components/ui/LangContext'

const sans = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' })
const display = Fraunces({ subsets: ['latin'], weight: ['300', '400'], style: ['normal', 'italic'], variable: '--font-display' })
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Bärc — laundry care system',
  description:
    'Bärc is a laundry care system: capsules, powder, gel and stain remover built on one formula platform.'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F7F6F4'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
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
