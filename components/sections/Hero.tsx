'use client'
import { useEffect } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'

/**
 * Every format is on screen in the first second, so the brand reads as a system
 * rather than one hero SKU. The copy block owns the upper left and keeps its own
 * call to action directly beneath it; the range stands on a shelf that spans the
 * full width, so a wide screen fills instead of drifting to one side.
 */
const HERO_ORDER = ['powder', 'crystal', 'amethyst', 'original', 'gel', 'stain']

/** Height of each pack as a share of the shelf, centre-weighted. */
const WEIGHT = [0.58, 0.8, 1, 0.96, 0.78, 0.56]

export default function Hero() {
  const { lang } = useLang()
  useEffect(() => { observeReveals() }, [lang])

  const ordered = HERO_ORDER
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean) as typeof PRODUCTS

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 md:h-[100svh] md:min-h-[620px] md:pt-28">
      <div className="wrap">
        <p className="kicker" data-rv>{pick(COPY.hero.kicker, lang)}</p>

        <h1 className="display mt-3 max-w-[16ch] text-[clamp(2.3rem,7vw,6.4rem)]">
          <Lines lines={[pick(COPY.hero.line1, lang)]} start={80} />
          <span className="italic" style={{ color: 'var(--accent)' }}>
            <Lines lines={[pick(COPY.hero.line2, lang)]} start={200} />
          </span>
        </h1>

        {/* copy and its buttons stay together, directly under the headline */}
        <div className="mt-6 max-w-[38rem]">
          <p className="lede text-[0.92rem] md:text-[1.04rem]" data-rv style={{ ['--d' as string]: '320ms' }}>
            {pick(COPY.hero.lede, lang)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3" data-rv style={{ ['--d' as string]: '420ms' }}>
            <a href="#system" className="btn btn-pink">{pick(COPY.hero.cta, lang)}</a>
            <a href="#contact" className="btn btn-line">{pick(COPY.hero.alt, lang)}</a>
          </div>
        </div>
      </div>

      {/* phones: two rows of three, so six labels never fight for one line */}
      <div className="relative w-full px-4 pb-4 pt-6 md:hidden">
        <ul className="grid grid-cols-3 items-end gap-x-2 gap-y-5">
          {ordered.map((p, i) => (
            <li key={p.slug} className="flex flex-col items-center" data-rv style={{ ['--d' as string]: `${260 + i * 70}ms` }}>
              <div className="relative flex h-[clamp(78px,15svh,124px)] items-end justify-center">
                <img src={p.image} alt={p.name} className="max-h-full w-auto object-contain" loading={i < 3 ? 'eager' : 'lazy'} />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-1/2 h-2 w-[72%] -translate-x-1/2 translate-y-1/2 rounded-[50%] blur-[5px]"
                  style={{ background: `color-mix(in srgb, ${p.tint} 55%, transparent)`, opacity: 0.5 }}
                />
              </div>
              <span
                className="mt-3 text-center font-mono text-[0.72rem] leading-tight tracking-[0.08em] uppercase"
                style={{ color: 'var(--fg-mute)' }}
              >
                {pick(COPY.chain.categories[p.category], lang)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* md+: one shelf, full width, all six standing on the same baseline */}
      <div className="relative hidden min-h-0 w-full flex-1 pb-2 md:block">
        <ul className="flex h-full w-full items-end justify-between gap-1 px-8 lg:px-14">
          {ordered.map((p, i) => (
            <li
              key={p.slug}
              className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-end"
              style={{ height: `${WEIGHT[i] * 100}%` }}
              data-rv
            >
              <div className="relative flex min-h-0 w-full flex-1 items-end justify-center">
                <img
                  src={p.image}
                  alt={p.name}
                  className="max-h-full w-auto object-contain"
                  style={{ animation: `float ${7 + i * 0.7}s ease-in-out ${i * -0.9}s infinite alternate` }}
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-1/2 h-3 w-[78%] -translate-x-1/2 translate-y-1/2 rounded-[50%] blur-[6px]"
                  style={{ background: `color-mix(in srgb, ${p.tint} 55%, transparent)`, opacity: 0.55 }}
                />
              </div>
              <span
                className="mt-4 shrink-0 whitespace-nowrap font-mono text-[0.72rem] tracking-[0.14em] uppercase"
                style={{ color: 'var(--fg-mute)' }}
              >
                {pick(COPY.chain.categories[p.category], lang)}
              </span>
            </li>
          ))}
        </ul>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[1.85rem] h-px"
          style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--fg) 24%, transparent) 14%, color-mix(in srgb, var(--fg) 24%, transparent) 86%, transparent)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: 'radial-gradient(55% 100% at 50% 100%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 72%)' }}
        />
      </div>

      <div
        className="wrap flex shrink-0 items-center justify-between gap-4 pb-5 pt-3 font-mono text-[0.72rem] tracking-[0.16em] uppercase"
        style={{ color: 'var(--fg-mute)' }}
      >
        <span data-rv style={{ ['--d' as string]: '620ms' }}>{pick(COPY.hero.meta, lang)}</span>
        <span data-rv style={{ ['--d' as string]: '680ms' }} dir="ltr">{PRODUCTS.length} formats</span>
      </div>

      <style>{`
        @keyframes float { from { transform: translateY(0) } to { transform: translateY(-11px) } }
        @media (prefers-reduced-motion: reduce) { li img { animation: none !important } }
      `}</style>
    </section>
  )
}
