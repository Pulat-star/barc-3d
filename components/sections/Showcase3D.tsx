'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'

/** The WebGL bundle is only fetched once this section is close to the viewport. */
const PackViewer = dynamic(() => import('@/components/ui/PackViewer'), { ssr: false })

const MODELLED = PRODUCTS.filter((p) => p.model)

export default function Showcase3D() {
  const { lang } = useLang()
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [armed, setArmed] = useState(false)
  const [onScreen, setOnScreen] = useState(false)

  useEffect(() => { observeReveals() }, [lang, active])

  useEffect(() => {
    const el = section.current
    if (!el) return
    // no WebGL, no point downloading three.js
    let gl = false
    try {
      const c = document.createElement('canvas')
      gl = !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch { gl = false }
    if (!gl) return

    const arm = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setArmed(true); arm.disconnect() } },
      { rootMargin: '300px 0px' }
    )
    arm.observe(el)

    const live = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: '80px 0px' })
    live.observe(el)

    return () => { arm.disconnect(); live.disconnect() }
  }, [])

  const product = MODELLED[active]

  return (
    <section ref={section} id="pack" className="relative py-20 md:py-32">
      <div className="wrap grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div>
          <p className="kicker" data-rv>{pick(COPY.pack.kicker, lang)}</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4.6vw,3.6rem)]">
            <Lines lines={[pick(COPY.pack.title, lang)]} start={80} />
          </h2>
          <p className="lede mt-5" data-rv style={{ ['--d' as string]: '170ms' }}>
            {pick(COPY.pack.lede, lang)}
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5" data-rv style={{ ['--d' as string]: '260ms' }}>
            {MODELLED.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => setActive(i)}
                className="rounded-full px-4 py-2 text-[0.85rem] font-semibold transition-transform duration-500 hover:-translate-y-0.5"
                style={
                  i === active
                    ? { background: p.tint, color: '#fff' }
                    : { border: '1px solid color-mix(in srgb, var(--fg) 26%, transparent)', color: 'var(--fg)' }
                }
              >
                {p.name}
              </button>
            ))}
          </div>

          <p className="mt-5 font-mono text-[0.75rem] tracking-[0.18em] uppercase" style={{ color: 'var(--fg-mute)' }} data-rv>
            {pick(COPY.pack.hint, lang)}
          </p>
        </div>

        <div
          className="relative h-[52svh] min-h-[320px] overflow-hidden rounded-[2rem] md:h-[62svh]"
          style={{
            background: 'radial-gradient(70% 60% at 50% 40%, color-mix(in srgb, var(--bg-2) 92%, #fff 8%), var(--bg))',
            border: '1px solid color-mix(in srgb, var(--fg) 14%, transparent)'
          }}
          data-rv
        >
          {armed ? (
            <PackViewer src={product.model!} tint={product.tint} active={onScreen} />
          ) : (
            <img src={product.image} alt={product.name} className="absolute inset-0 m-auto max-h-[80%] w-auto object-contain" />
          )}
        </div>
      </div>
    </section>
  )
}
