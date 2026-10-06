'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Benefits from '@/components/site/Benefits'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'

/** 09 Desktop · About — the brand in two paragraphs, then the benefits band. */
export default function AboutPage() {
  const { lang } = useLang()
  const a = COPY.site.about
  useEffect(() => { observeReveals() }, [lang])

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'calc(88px + var(--sa-top))' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-10 text-center md:px-12 md:pb-16 md:pt-14">
          <p className="eyebrow" data-rv>{pick(a.eyebrow, lang)}</p>
          <h1 className="display mx-auto mt-6 max-w-[1280px] text-[clamp(2.2rem,5.6vw,4.4rem)]">
            <span className="line"><span className="line__i">{pick(a.title, lang)}</span></span>
          </h1>
        </div>

        <div className="mx-auto max-w-[760px] px-6 pb-16 text-center md:px-12 md:pb-20">
          <p className="text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.7]" data-rv>{pick(a.p1, lang)}</p>
          <p className="mt-6 text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.7]" data-rv style={{ ['--d' as string]: '110ms' }}>
            {pick(a.p2, lang)}
          </p>
          <Link href="/products/" className="btn btn-grape mt-9" data-rv style={{ ['--d' as string]: '200ms' }}>
            {pick(COPY.site.nav.products, lang)}
          </Link>
        </div>

        <Benefits />
      </main>
      <Footer />
    </>
  )
}
