'use client'
import { useEffect } from 'react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import ProductCard from '@/components/site/ProductCard'
import { RELEASED } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'

/** The catalogue: the released scents, side by side. */
export default function Catalogue() {
  const { lang } = useLang()
  const p = COPY.site.products
  useEffect(() => { observeReveals() }, [lang])

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'calc(88px + var(--sa-top))' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-10 text-center md:px-12 md:pb-20 md:pt-14">
          <p className="eyebrow" data-rv>{pick(p.eyebrow, lang)}</p>
          <h1 className="display mx-auto mt-6 max-w-[1280px] text-[clamp(2.2rem,6vw,5rem)]">
            <span className="line"><span className="line__i">{pick(p.title, lang)}</span></span>
          </h1>
          <p className="lede mx-auto mt-5 max-w-[60ch]" data-rv style={{ ['--d' as string]: '120ms' }}>
            {pick(p.sub, lang)}
          </p>
        </div>

        <div className="mx-auto grid max-w-[1340px] gap-6 px-6 pb-20 md:grid-cols-3 md:gap-12 md:px-12 md:pb-28">
          {RELEASED.map((product, i) => (
            <ProductCard key={product.slug} product={product} delay={i * 110} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
