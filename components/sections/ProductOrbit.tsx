'use client'
import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/masterTimeline'
import { observeReveals, revealIn } from '@/lib/reveal'
import { scramble } from '@/lib/scramble'

/**
 * The whole range on one track. Scroll carries every format past a fixed stage;
 * each one swells and sharpens as it arrives and rides an arc that flattens to
 * nothing exactly at centre — so the products read as one connected system
 * rather than six separate slides.
 *
 * Distance from centre drives a cosine-squared falloff for scale, opacity and
 * blur; the copy lives in its own column so the orbit never crosses it.
 */
export default function ProductOrbit() {
  const { lang } = useLang()
  const section = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const tiles = useRef<(HTMLDivElement | null)[]>([])
  const nameEl = useRef<HTMLHeadingElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    registerGsap()
    const sec = section.current
    const pinEl = pin.current
    const stageEl = stage.current
    const items = tiles.current.filter(Boolean) as HTMLDivElement[]
    if (!sec || !pinEl || !stageEl || items.length !== PRODUCTS.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const mobile = () => window.matchMedia('(max-width: 859px)').matches
    const dirs = items.map((_, i) => (i % 2 === 0 ? -1 : 1))

    let fall = 0, spacing = 0, lead = 0, travel = 0, bow = 0, anchorX = 0, anchorY = 0

    const measure = () => {
      const vw = window.innerWidth
      const m = mobile()
      const pinRect = pinEl.getBoundingClientRect()
      const st = stageEl.getBoundingClientRect()
      // the track is centred on the stage column, not the viewport
      anchorX = st.left + st.width / 2 - (pinRect.left + pinRect.width / 2)
      anchorY = st.top + st.height / 2 - (pinRect.top + pinRect.height / 2)
      fall = m ? vw * 0.62 : st.width * 0.95
      spacing = m ? Math.max(200, vw * 0.72) : Math.max(260, st.width * 0.62)
      lead = fall + (m ? 80 : 150)
      travel = (items.length - 1) * spacing + 2 * lead
      bow = (m ? st.height : pinEl.clientHeight) * (m ? 0.2 : 0.26)
    }

    const draw = (progress: number) => {
      const m = mobile()
      let best = 0
      let bestDist = Infinity

      for (let i = 0; i < items.length; i++) {
        const tile = items[i]
        const x = lead + i * spacing - progress * travel
        const away = Math.min(1, Math.abs(x) / fall)
        const bell = Math.cos((away * Math.PI) / 2) ** 2

        const scale = (m ? 0.42 : 0.38) + (m ? 0.62 : 0.72) * bell
        // the arc flattens to zero exactly as a product arrives
        const y = dirs[i] * bow * (1 - bell)

        tile.style.transform =
          `translate3d(calc(-50% + ${(anchorX + x).toFixed(1)}px), calc(-50% + ${(anchorY + y).toFixed(1)}px), 0) scale(${scale.toFixed(3)})`
        tile.style.opacity = String(bell < 0.03 ? 0 : Math.min(1, bell * 2.3))
        tile.style.filter = m || bell > 0.86 ? 'none' : `blur(${((1 - bell) * 2.4).toFixed(2)}px)`
        tile.style.zIndex = String(10 + Math.round(bell * 20))

        if (Math.abs(x) < bestDist) { bestDist = Math.abs(x); best = i }
      }
      setStep((prev) => (prev === best ? prev : best))
    }

    measure()
    draw(0)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinEl,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onUpdate: (self) => draw(self.progress),
        onToggle: (self) => {
          for (const t of items) t.style.willChange = self.isActive ? 'transform' : 'auto'
        }
      })
    }, sec)

    const onResize = () => { measure() }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); ctx.revert() }
  }, [])

  // the name resolves out of noise each time the orbit hands over
  useEffect(() => {
    if (nameEl.current) scramble(nameEl.current, PRODUCTS[step].name)
    revealIn(pin.current)
    observeReveals()
  }, [step, lang])

  const active = PRODUCTS[step]

  return (
    <section ref={section} id="system" className="relative" style={{ height: `${PRODUCTS.length * 95}svh` }}>
      <div ref={pin} className="relative h-[100svh] overflow-hidden">
        <p
          className="wrap pointer-events-none absolute inset-x-0 top-24 z-30 font-mono text-[0.76rem] tracking-[0.2em] uppercase"
          style={{ color: 'var(--fg-mute)' }}
        >
          {pick(COPY.chain.label, lang)}
        </p>

        {PRODUCTS.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => { tiles.current[i] = el }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[clamp(140px,17vw,250px)] will-change-transform"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full object-contain"
              style={{ maxWidth: 'none' }}
              loading={i < 3 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        <div className="wrap absolute inset-0 grid items-center gap-5 md:grid-cols-2 md:gap-10">
          <div className="relative z-20 order-2 self-end pb-24 text-center md:order-1 md:self-center md:pb-0 md:text-start">
            <p className="kicker" style={{ color: active.tint }}>
              {pick(COPY.chain.categories[active.category], lang)}
            </p>
            <h2 ref={nameEl} className="display mt-3 text-[clamp(2rem,5.4vw,4.4rem)]" style={{ minHeight: '1.15em' }}>
              {active.name}
            </h2>
            <p className="mt-4 text-[1.02rem] font-semibold md:text-[1.18rem]">
              {pick(COPY.chain.promise[active.slug], lang)}
            </p>
            <p className="lede mx-auto mt-2.5 md:mx-0">{pick(COPY.chain.detail[active.slug], lang)}</p>
            <p
              className="mt-5 inline-flex items-center rounded-full px-3.5 py-1.5 font-mono text-[0.75rem] tracking-[0.16em] uppercase"
              style={
                active.available
                  ? { background: active.tint, color: '#fff' }
                  : { border: '1px solid color-mix(in srgb, var(--fg) 26%, transparent)', color: 'var(--fg-mute)' }
              }
            >
              {active.available ? pick(COPY.chain.available, lang) : pick(COPY.chain.soon, lang)}
            </p>
          </div>

          {/* the stage the orbit is centred on */}
          <div ref={stage} aria-hidden className="order-1 h-[40svh] w-full md:order-2 md:h-[64svh]" />
        </div>

        <div className="wrap pointer-events-none absolute inset-x-0 bottom-7 z-30 flex items-center justify-between">
          <div className="flex gap-1.5">
            {PRODUCTS.map((p, i) => (
              <span
                key={p.slug}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === step ? 34 : 13,
                  background: i === step ? p.tint : 'color-mix(in srgb, var(--fg) 24%, transparent)'
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[0.76rem] tracking-[0.14em]" style={{ color: 'var(--fg-mute)' }} dir="ltr">
            {String(step + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  )
}
