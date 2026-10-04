'use client'
import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { buildChain, createChainState, registerGsap } from '@/lib/masterTimeline'
import { observeReveals, revealIn } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

export default function ProductChain() {
  const { lang } = useLang()
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const items = useRef<(HTMLImageElement | null)[]>([])
  const [step, setStep] = useState(0)
  const stateRef = useRef(createChainState())

  /* ---------------- the one master timeline ---------------- */
  useEffect(() => {
    registerGsap()
    const s = section.current, st = stage.current
    const els = items.current.filter(Boolean) as HTMLElement[]
    if (!s || !st || els.length !== PRODUCTS.length) return
    return buildChain({ section: s, stage: st, items: els, state: stateRef.current, onStep: setStep })
  }, [])

  /* ------- particle bridge: one product dissolving into the next ------- */
  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const COUNT = window.innerWidth < 760 ? 120 : 240
    const seeds = Array.from({ length: COUNT }, () => ({
      ax: Math.random(), ay: Math.random(),
      bx: Math.random(), by: Math.random(),
      arc: (Math.random() - 0.5) * 2,
      lag: Math.random() * 0.26,
      r: 1.4 + Math.random() * 2.8
    }))

    let raf = 0
    let dpr = 1
    let live = true
    const vis = new IntersectionObserver(([e]) => { live = e.isIntersecting }, { rootMargin: '120px 0px' })
    if (section.current) vis.observe(section.current)

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = cv.clientWidth * dpr
      cv.height = cv.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    window.addEventListener('resize', size)

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!live) return
      const s = stateRef.current
      ctx.clearRect(0, 0, cv.clientWidth, cv.clientHeight)

      if (s.morph > 0.002) {
        const box = cv.getBoundingClientRect()
        const a = items.current[s.from]?.getBoundingClientRect()
        const b = items.current[s.to]?.getBoundingClientRect()
        if (a && b) {
          const ca = hex(PRODUCTS[s.from].tint)
          const cb = hex(PRODUCTS[s.to].tint)
          const fade = Math.sin(Math.min(1, s.morph) * Math.PI)

          for (const p of seeds) {
            // each particle runs its own slightly delayed leg of the journey
            const t = Math.min(1, Math.max(0, (s.morph - p.lag) / (1 - p.lag)))
            const e = t * t * (3 - 2 * t)
            const x0 = a.left - box.left + a.width * p.ax
            const y0 = a.top - box.top + a.height * p.ay
            const x1 = b.left - box.left + b.width * p.bx
            const y1 = b.top - box.top + b.height * p.by
            const lift = Math.sin(e * Math.PI) * 70 * p.arc

            const x = x0 + (x1 - x0) * e + lift
            const y = y0 + (y1 - y0) * e - Math.sin(e * Math.PI) * 40

            const col = ca.map((v, i) => Math.round(v + (cb[i] - v) * e))
            ctx.globalAlpha = fade * (0.45 + 0.55 * (1 - Math.abs(e - 0.5) * 2))
            ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`
            ctx.beginPath()
            ctx.arc(x, y, p.r * (0.6 + fade * 0.8), 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.globalAlpha = 1
        }
      }
    }
    raf = requestAnimationFrame(frame)

    return () => { cancelAnimationFrame(raf); vis.disconnect(); window.removeEventListener('resize', size) }
  }, [])

  useEffect(() => { revealIn(stage.current); observeReveals() }, [step, lang])

  const active = PRODUCTS[step]

  return (
    <section ref={section} id="system" className="relative">
      <div ref={stage} className="relative flex h-[100svh] items-center overflow-hidden">
        <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

        <p className="wrap pointer-events-none absolute inset-x-0 top-24 z-10 font-mono text-[0.75rem] tracking-[0.2em] uppercase" style={{ color: 'var(--fg-mute)' }}>
          {pick(COPY.chain.label, lang)}
        </p>

        <div className="wrap relative z-10 grid w-full items-center gap-8 md:grid-cols-2 md:gap-10">
          {/* info — swaps as the chain advances */}
          <div key={active.slug} className="order-2 md:order-1">
            <p className="kicker" data-rv>{pick(COPY.chain.categories[active.category], lang)}</p>
            <h2 className="display mt-3 text-[clamp(2rem,5.4vw,4.4rem)]">
              <Lines lines={[active.name]} start={70} />
            </h2>
            <p className="mt-4 text-[1.05rem] font-semibold md:text-[1.25rem]" data-rv style={{ ['--d' as string]: '150ms' }}>
              {pick(COPY.chain.promise[active.slug], lang)}
            </p>
            <p className="lede mt-2.5" data-rv style={{ ['--d' as string]: '210ms' }}>
              {pick(COPY.chain.detail[active.slug], lang)}
            </p>
            <p
              className="mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.75rem] tracking-[0.16em] uppercase"
              data-rv
              style={{
                ['--d' as string]: '250ms',
                color: active.available ? '#fff' : 'var(--fg)',
                background: active.available ? active.tint : 'transparent',
                border: active.available ? 'none' : '1px solid color-mix(in srgb, var(--fg) 26%, transparent)'
              }}
            >
              {active.available ? pick(COPY.chain.available, lang) : pick(COPY.chain.soon, lang)}
            </p>
          </div>

          {/* the stack — every product lives here, the timeline reveals one at a time */}
          <div className="order-1 flex h-[38svh] items-center justify-center md:order-2 md:h-[62svh]">
            <div className="relative h-full w-full">
              {PRODUCTS.map((p, i) => (
                <img
                  key={p.slug}
                  ref={(el) => { items.current[i] = el }}
                  src={p.image}
                  alt={p.name}
                  className="absolute inset-0 m-auto max-h-full w-auto object-contain opacity-0 will-change-transform"
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* rail */}
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-7 z-10 flex items-center justify-between">
          <div className="flex gap-1.5">
            {PRODUCTS.map((p, i) => (
              <span
                key={p.slug}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === step ? 34 : 13,
                  background: i === step ? p.tint : 'color-mix(in srgb, var(--fg) 22%, transparent)'
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[0.76rem] tracking-[0.14em]" style={{ color: 'var(--fg-mute)' }}>
            {String(step + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  )
}
