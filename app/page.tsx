'use client'
import { useEffect } from 'react'
import Navbar from '@/components/ui/Navbar'
import Hero from '@/components/sections/Hero'
import ProductChain from '@/components/sections/ProductChain'
import Range from '@/components/sections/Range'
import Formula from '@/components/sections/Formula'
import Showcase3D from '@/components/sections/Showcase3D'
import HowTo from '@/components/sections/HowTo'
import Stats from '@/components/sections/Stats'
import Lifestyle from '@/components/sections/Lifestyle'
import Contact from '@/components/sections/Contact'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { ScrollTrigger, registerGsap } from '@/lib/masterTimeline'
import Wordmark from '@/components/ui/Wordmark'

export default function Page() {
  const { lang } = useLang()

  useEffect(() => {
    registerGsap()
    observeReveals()
    // fonts and lazy images change section heights — re-measure the pin once settled
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 450)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => window.clearTimeout(t)
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductChain />
        <Range />
        <HowTo />
        <Stats />
        <Formula />
        <Showcase3D />
        <Lifestyle />
        <Contact />
      </main>
      <footer className="relative py-12" style={{ borderTop: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)' }}>
        <div className="wrap flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="no-flip"><Wordmark size="1.6rem" /></div>
            <p className="font-display mt-3 text-[1rem] italic" style={{ color: 'var(--accent)' }}>
              {pick(COPY.footer.tag, lang)}
            </p>
          </div>
          <p className="font-mono text-[0.76rem] tracking-[0.14em] uppercase" style={{ color: 'var(--fg-mute)' }}>
            © {new Date().getFullYear()} · {pick(COPY.footer.rights, lang)}
          </p>
        </div>
      </footer>
    </>
  )
}
