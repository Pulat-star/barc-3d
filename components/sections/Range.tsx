'use client'
import { useEffect } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'

/** The catalogue. A new Bärc line appears here by adding one entry to PRODUCTS. */
export default function Range() {
  const { lang } = useLang()
  useEffect(() => { observeReveals() }, [lang])

  return (
    <section id="range" data-nav="light" className="relative py-16 md:py-24">
      <div className="light-panel wrap">
        <p className="kicker" data-rv>{pick(COPY.chain.kicker, lang)}</p>
        <h2 className="display mt-3 text-[clamp(1.9rem,5vw,4rem)]">
          <Lines lines={[pick(COPY.chain.title, lang)]} start={80} />
        </h2>
        <p className="lede mt-5" data-rv style={{ ['--d' as string]: '150ms' }}>
          {pick(COPY.chain.rangeLede, lang)}
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <article
              key={p.slug}
              data-rv
              style={{ ['--d' as string]: `${120 + i * 90}ms`, borderColor: 'color-mix(in srgb, var(--fg) 12%, transparent)' }}
              className="group relative overflow-hidden rounded-3xl border bg-white/70 p-6 transition-transform duration-500 hover:-translate-y-1.5"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-6 -top-8 h-48 rounded-full opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-90"
                style={{ background: `radial-gradient(circle, ${p.tint}44, transparent 70%)` }}
              />
              <div className="relative flex h-44 items-center justify-center">
                <img src={p.image} alt={p.name} className="max-h-full w-auto object-contain" loading="lazy" />
              </div>

              <div className="relative mt-5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[0.75rem] tracking-[0.18em] uppercase" style={{ color: 'var(--fg-mute)' }}>
                    {pick(COPY.chain.categories[p.category], lang)}
                  </p>
                  <h3 className="display mt-1 text-[1.5rem] italic">{p.name}</h3>
                  <p className="mt-1.5 text-[0.92rem] font-semibold leading-snug">
                    {pick(COPY.chain.promise[p.slug], lang)}
                  </p>
                  <p className="mt-1.5 text-[0.84rem] leading-snug" style={{ color: 'var(--fg-mute)' }}>
                    {pick(COPY.chain.detail[p.slug], lang)}
                  </p>
                </div>
              </div>

              <p
                className="relative mt-4 inline-flex rounded-full px-3 py-1.5 font-mono text-[0.75rem] tracking-[0.16em] uppercase"
                style={
                  p.available
                    ? { background: p.tint, color: '#fff' }
                    : { border: '1px solid color-mix(in srgb, var(--fg) 24%, transparent)', color: 'var(--fg-mute)' }
                }
              >
                {p.available ? pick(COPY.chain.available, lang) : pick(COPY.chain.soon, lang)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
