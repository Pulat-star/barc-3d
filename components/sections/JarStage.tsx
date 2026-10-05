'use client'
import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/masterTimeline'

/**
 * The landing stage: one full viewport, no page furniture, and scroll drives a
 * carousel instead of moving the page. Packs ride a shallow arc across an
 * organic plinth — the centre one upright and large, its neighbours tilted and
 * smaller — with a ring of brand words turning behind them.
 *
 * The section is pinned, so the carousel consumes a fixed run of scroll and then
 * releases into the rest of the page.
 */
export default function JarStage() {
  const { lang } = useLang()
  const section = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGGElement>(null)
  const items = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [cursor, setCursor] = useState<{ x: number; y: number; on: boolean }>({ x: 0, y: 0, on: false })
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(max-width: 859px)')
    const set = () => setNarrow(m.matches)
    set()
    m.addEventListener('change', set)
    return () => m.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    registerGsap()
    const sec = section.current
    const pinEl = pin.current
    const tiles = items.current.filter(Boolean) as HTMLDivElement[]
    if (!sec || !pinEl || tiles.length !== PRODUCTS.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const mobile = () => window.matchMedia('(max-width: 859px)').matches
    let step = 0, lead = 0, travel = 0, fall = 0

    const measure = () => {
      const w = pinEl.clientWidth
      const m = mobile()
      step = m ? w * 0.56 : Math.min(360, w * 0.235)
      fall = m ? w * 0.62 : w * 0.34
      lead = 0
      travel = (tiles.length - 1) * step + 2 * lead
    }

    const draw = (p: number) => {
      let best = 0, bestD = Infinity
      for (let i = 0; i < tiles.length; i++) {
        const x = lead + i * step - p * travel
        const away = Math.min(1, Math.abs(x) / fall)
        const bell = Math.cos((away * Math.PI) / 2) ** 2

        // the centre pack straightens and grows; its neighbours lean away
        const tilt = (x / fall) * 13
        const scale = 0.62 + 0.46 * bell
        const lift = (1 - bell) * 36

        tiles[i].style.transform =
          `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${lift.toFixed(1)}px), 0) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`
        tiles[i].style.opacity = String(bell < 0.02 ? 0 : Math.min(1, 0.3 + bell * 1.5))
        tiles[i].style.zIndex = String(10 + Math.round(bell * 20))

        if (Math.abs(x) < bestD) { bestD = Math.abs(x); best = i }
      }
      if (ringRef.current) ringRef.current.style.transform = `rotate(${(p * 150 - 30).toFixed(2)}deg)`
      setActive((prev) => (prev === best ? prev : best))
    }

    measure(); draw(0)

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
          for (const t of tiles) t.style.willChange = self.isActive ? 'transform' : 'auto'
        }
      })
    }, sec)

    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); ctx.revert() }
  }, [])

  const ring = pick(COPY.stage.ring, lang).repeat(3)

  return (
    <section ref={section} id="top" className="relative" style={{ height: `${PRODUCTS.length * 78}svh` }}>
      <div
        ref={pin}
        className="relative h-[100svh] overflow-hidden"
        onPointerMove={(e) => setCursor((c) => ({ ...c, x: e.clientX, y: e.clientY }))}
      >
        {/* the plinth and its ring of words */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-[26%] md:top-[30%]">
          <svg viewBox="0 0 1000 620" preserveAspectRatio={narrow ? "xMidYMid meet" : "xMidYMax slice"} className="h-full w-full">
            <defs>
              <path id="barc-ring" d="M500,338 m-268,0 a268,268 0 1,1 536,0 a268,268 0 1,1 -536,0" />
              <linearGradient id="barc-plinth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4A1578" />
                <stop offset="1" stopColor="#2A0846" />
              </linearGradient>
            </defs>
            {/* an organic plinth rather than a rectangle */}
            <path
              fill="url(#barc-plinth)"
              d="M139 268 C 232 168, 392 150, 512 152 C 648 154, 812 176, 886 272 C 944 346, 938 470, 902 560 C 872 634, 128 634, 100 556 C 64 462, 72 340, 139 268 Z"
            />
            <g ref={ringRef} style={{ transformOrigin: '500px 338px', transition: 'transform .1s linear' }}>
              <text fill="var(--accent)" fontSize="27" letterSpacing="5" style={{ fontFamily: 'var(--font-brand)', fontWeight: 800, opacity: 0.8 }}>
                <textPath href="#barc-ring" startOffset="0%">{ring}</textPath>
              </text>
            </g>
          </svg>
        </div>

        {/* the packs */}
        <div className="absolute left-1/2 top-[46%] z-10 h-0 w-0 md:top-[50%]">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.slug}
              ref={(el) => { items.current[i] = el }}
              className="absolute left-0 top-0 w-[clamp(132px,16vw,232px)] cursor-pointer will-change-transform"
              onPointerEnter={() => setCursor((c) => ({ ...c, on: true }))}
              onPointerLeave={() => setCursor((c) => ({ ...c, on: false }))}
              onClick={() => { document.getElementById('range')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              <img src={p.image} alt={p.name} className="w-full object-contain" style={{ maxWidth: 'none' }} loading={i < 3 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>

        {/* the reference states the proposition once, small, under the mark */}
        <h1
          className="absolute inset-x-0 top-[clamp(88px,13vh,140px)] z-20 mx-auto max-w-[30ch] px-6 text-center font-display text-[clamp(1.05rem,2.1vw,1.6rem)] font-light leading-snug"
          style={{ color: 'var(--fg)' }}
        >
          {pick(COPY.hero.line1, lang)} {pick(COPY.hero.line2, lang)}
        </h1>

        <p
          className="absolute inset-x-0 bottom-7 z-20 text-center font-mono text-[0.76rem] tracking-[0.2em] uppercase"
          style={{ color: 'var(--fg-mute)' }}
        >
          {pick(COPY.stage.prompt, lang)}
        </p>

        {/* the cursor pill, as on the reference */}
        <span
          aria-hidden
          className="pointer-events-none fixed z-40 hidden items-center gap-2 rounded-full px-4 py-2 text-[0.8rem] font-semibold md:inline-flex"
          style={{
            left: cursor.x, top: cursor.y,
            transform: 'translate(-50%, -160%)',
            background: '#fff', color: '#2A0846',
            opacity: cursor.on ? 1 : 0,
            transition: 'opacity .2s linear'
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 1, background: 'var(--accent)', transform: 'rotate(45deg)' }} />
          {pick(COPY.stage.discover, lang)}
        </span>

        <p
          className="absolute bottom-16 end-[var(--pad)] z-20 font-mono text-[0.76rem] tracking-[0.14em] md:bottom-7"
          style={{ color: 'var(--fg-mute)' }}
          dir="ltr"
        >
          {String(active + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
        </p>
      </div>
    </section>
  )
}
