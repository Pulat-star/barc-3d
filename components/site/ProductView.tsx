'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Benefits from '@/components/site/Benefits'
import Usage from '@/components/site/Usage'
import ProductCard from '@/components/site/ProductCard'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'

/** 03–05 Desktop · a scent: the pack in its arch, then the two shared bands. */
export default function ProductView({ slug }: { slug: string }) {
  const { lang } = useLang()
  const site = COPY.site
  useEffect(() => { observeReveals() }, [lang, slug])

  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) return null

  const scent = site.scent[product.slug]
  const detail = COPY.chain.detail[product.slug]
  const related = PRODUCTS.filter((p) => p.available && p.slug !== slug)

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'calc(88px + var(--sa-top))' }}>
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 pb-14 pt-8 md:grid-cols-2 md:gap-16 md:px-12 md:pb-20 md:pt-12">
          <div className="order-2 text-center md:order-1 md:text-left">
            <Link href="/products/" className="group tap inline-flex items-center gap-2 text-[13px]" style={{ color: 'var(--muted)' }} data-rv>
              <span className="marker" />
              {pick(site.product.back, lang)}
            </Link>

            <h1 className="display mt-4 text-[clamp(2.6rem,7vw,5.2rem)]">
              <span className="line"><span className="line__i">{product.name}</span></span>
            </h1>

            {scent && <p className="mt-3 text-[clamp(1rem,1.5vw,1.2rem)]" style={{ color: 'var(--grape)' }} data-rv>{pick(scent, lang)}</p>}
            {detail && <p className="lede mx-auto mt-5 max-w-[44ch] md:mx-0" data-rv style={{ ['--d' as string]: '90ms' }}>{pick(detail, lang)}</p>}

            <ul className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[13px] md:justify-start" style={{ color: 'var(--muted)' }} data-rv>
              <li>{pick(site.product.spec1, lang)}</li>
              <li>{pick(site.product.spec2, lang)}</li>
              <li>{pick(site.product.spec3, lang)}</li>
            </ul>

            <Link href="/usage/" className="btn btn-white mt-8" data-rv style={{ ['--d' as string]: '180ms' }}>
              {pick(site.product.howto, lang)}
            </Link>
          </div>

          <div className="arch order-1 flex flex-col items-center px-6 pb-8 pt-12 md:order-2" data-rv>
            <img
              src={product.image}
              alt={product.name}
              className="depth h-[clamp(240px,34vw,480px)] w-auto object-contain"
              style={{ maxWidth: 'none' }}
            />
            <p className="eyebrow mt-6" style={{ color: 'var(--muted)' }}>BÄRC · {product.name}</p>
          </div>
        </div>

        <Benefits />
        <Usage />

        <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
          <h2 className="display mx-auto max-w-[20ch] text-center text-[clamp(1.9rem,4.4vw,3.2rem)]">
            <span className="line"><span className="line__i">{pick(site.product.related, lang)}</span></span>
          </h2>
          <div className="mx-auto mt-12 grid max-w-[900px] gap-6 md:grid-cols-2 md:gap-10">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} delay={i * 110} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
