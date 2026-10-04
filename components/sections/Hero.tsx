'use client'
import { useEffect } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'

/**
 * Every format is on screen in the first second, so the brand reads as a system
 * rather than one hero SKU. Shipping capsules sit at the centre of the arc; the
 * formats still in development sit at its edges.
 */
const HERO_ORDER = ['powder', 'crystal', 'amethyst', 'original', 'gel', 'stain']

/** x = centre across the stage, b = foot above the floor, s = share of stage height. */
const ARC = [
  { x: 11, b: 3,  s: 0.46 },
  { x: 27, b: 8,  s: 0.66 },
  { x: 43, b: 13, s: 0.92 },
  { x: 59, b: 13, s: 0.87 },
  { x: 75, b: 8,  s: 0.64 },
  { x: 89, b: 3,  s: 0.45 }
]

export default function Hero() {
  const { lang } = useLang()
  useEffect(() => { observeReveals() }, [lang])

  const ordered = HERO_ORDER
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean) as typeof PRODUCTS

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 md:h-[100svh] md:min-h-[600px] md:pt-28">
      <div className="wrap">
        <p className="kicker" data-rv>{pick(COPY.hero.kicker, lang)}</p>
        <h1 className="display mt-3 text-[clamp(2.2rem,7.2vw,6.2rem)]">
          <Lines lines={[pick(COPY.hero.line1, lang)]} start={80} />
          <span className="italic" style={{ color: 'var(--accent)' }}>
            <Lines lines={[pick(COPY.hero.line2, lang)]} start={200} />
          </span>
        </h1>

        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <p className="lede max-w-[30em] text-[0.88rem] md:text-[1.06rem]" data-rv style={{ ['--d' as string]: '320ms' }}>{pick(COPY.hero.lede, lang)}</p>
          <div className="flex shrink-0 flex-wrap gap-3" data-rv style={{ ['--d' as string]: '420ms' }}>
            <a href="#system" className="btn btn-pink">{pick(COPY.hero.cta, lang)}</a>
            <a href="#range" className="btn btn-line">{pick(COPY.hero.alt, lang)}</a>
          </div>
        </div>
      </div>

      {/* the cluster fills whatever height is left, so it can never overlap the copy */}
      <div className="relative mx-auto mt-6 min-h-[220px] w-full max-w-[1480px] md:mt-6 md:min-h-0 md:flex-1">
        {/* small phones: a compact grid, nothing cropped */}
        <div className="grid h-full min-h-[220px] grid-cols-3 items-end gap-x-2 gap-y-4 px-5 pb-1 md:hidden">
          {ordered.map((p, i) => (
            <figure key={p.slug} className="flex min-h-0 flex-col items-center justify-end" data-rv style={{ ['--d' as string]: `${260 + i * 70}ms` }}>
              <img src={p.image} alt={p.name} className="min-h-0 w-auto flex-1 object-contain" loading={i < 3 ? 'eager' : 'lazy'} />
              <figcaption className="mt-1.5 shrink-0 font-mono text-[0.75rem] tracking-[0.12em] uppercase" style={{ color: 'var(--fg-mute)' }}>
                {pick(COPY.chain.categories[p.category], lang)}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* md+: an arc with depth */}
        <div className="hidden h-full md:block">
          {ordered.map((p, i) => {
            const a = ARC[i]
            return (
              <figure
                key={p.slug}
                className="absolute flex -translate-x-1/2 flex-col items-center"
                data-rv
                style={{
                  left: `${a.x}%`,
                  bottom: `${a.b}%`,
                  height: `${a.s * 100}%`,
                  zIndex: Math.round(a.s * 10),
                  ['--d' as string]: `${300 + i * 80}ms`
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="min-h-0 w-auto flex-1 object-contain"
                  style={{ animation: `float ${7 + i * 0.7}s ease-in-out ${i * -0.9}s infinite alternate` }}
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
                <figcaption
                  className="mt-2.5 shrink-0 whitespace-nowrap font-mono text-[0.75rem] tracking-[0.14em] uppercase lg:text-[0.75rem] lg:tracking-[0.18em]"
                  style={{ color: 'var(--fg-mute)' }}
                >
                  {pick(COPY.chain.categories[p.category], lang)}
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>

      <div className="wrap flex shrink-0 items-center justify-between pb-5 pt-3 font-mono text-[0.75rem] tracking-[0.18em] uppercase" style={{ color: 'var(--fg-mute)' }}>
        <span data-rv style={{ ['--d' as string]: '620ms' }}>{pick(COPY.hero.meta, lang)}</span>
        <span data-rv style={{ ['--d' as string]: '680ms' }}>{PRODUCTS.length} formats</span>
      </div>

      <style>{`
        @keyframes float { from { transform: translateY(0) } to { transform: translateY(-13px) } }
        @media (prefers-reduced-motion: reduce) { figure img { animation: none !important } }
      `}</style>
    </section>
  )
}
