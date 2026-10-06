'use client'
import { useEffect } from 'react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Gallery from '@/components/site/Gallery'
import ProductCard from '@/components/site/ProductCard'
import Benefits from '@/components/site/Benefits'
import Usage from '@/components/site/Usage'
import { RELEASED } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { ScrollTrigger, registerGsap } from '@/lib/masterTimeline'
import Link from 'next/link'

/**
 * Home. The first screen is pinned, so scrolling turns the carousel rather
 * than moving the page; the sections below are what the pin releases into.
 */
export default function Home() {
  const { lang } = useLang()
  const site = COPY.site

  useEffect(() => {
    registerGsap()
    observeReveals()
    // fonts settle after first paint and change the pin's measurements
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 420)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => window.clearTimeout(t)
  }, [lang])

  return (
    <>
      <Header />
      <main>
        <Gallery />

        <section id="mahsulotlar" className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
          <div className="text-center">
            <p className="eyebrow" data-rv>{pick(site.products.eyebrow, lang)}</p>
            <h2 className="display mx-auto mt-5 max-w-[20ch] text-[clamp(2rem,5vw,3.6rem)]">
              <span className="line"><span className="line__i">{pick(site.products.title, lang)}</span></span>
            </h2>
            <p className="lede mx-auto mt-4 max-w-[52ch]" data-rv style={{ ['--d' as string]: '120ms' }}>
              {pick(site.products.sub, lang)}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-10">
            {RELEASED.map((p, i) => (
              <ProductCard key={p.slug} product={p} delay={i * 110} />
            ))}
          </div>
        </section>

        <Benefits id="afzalliklar" />
        <Usage id="qanday-ishlatiladi" />

        <section id="barc-haqida" className="mx-auto max-w-[1440px] px-6 py-16 text-center md:px-12 md:py-24">
          <p className="eyebrow" data-rv>{pick(site.brand.eyebrow, lang)}</p>
          <h2 className="display mx-auto mt-5 max-w-[18ch] text-[clamp(2rem,5vw,3.6rem)]">
            <span className="line"><span className="line__i">{pick(site.brand.title, lang)}</span></span>
          </h2>
          <p className="lede mx-auto mt-5 max-w-[52ch]" data-rv style={{ ['--d' as string]: '120ms' }}>
            {pick(site.brand.body, lang)}
          </p>
          <Link href="/mahsulotlar/" className="btn btn-grape mt-9" data-rv style={{ ['--d' as string]: '200ms' }}>
            {pick(site.home.cta, lang)}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
