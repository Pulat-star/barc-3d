'use client'
import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/masterTimeline'
import dynamic from 'next/dynamic'
import ProductPanel from '@/components/ui/ProductPanel'
import { stageScroll } from '@/lib/stageScroll'
import type { Product } from '@/lib/products'

const StagePack = dynamic(() => import('@/components/ui/StagePack'), { ssr: false })

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
  // the live model has to ride the same arc as the flat pack it stands in for,
  // or the two drift apart mid-transition and the product reads twice
  const ghost = useRef<HTMLDivElement>(null)
  const ghostPose = useRef({ transform: '', opacity: '1' })
  const [active, setActive] = useState(0)
  const [cursor, setCursor] = useState<{ x: number; y: number; on: boolean }>({ x: 0, y: 0, on: false })
  const [narrow, setNarrow] = useState(false)
  const [detail, setDetail] = useState<Product | null>(null)
  const [gl, setGl] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  // only one WebGL context should be alive at a time: the film further down the
  // page has its own, and two at once costs a lost context on weaker devices
  const [inView, setInView] = useState(true)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setGl(!!(c.getContext('webgl2') || c.getContext('webgl')))
    } catch { setGl(false) }
  }, [])

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

        if (Math.abs(x) < bestD) {
          bestD = Math.abs(x); best = i
          ghostPose.current = { transform: tiles[i].style.transform, opacity: tiles[i].style.opacity }
        }
      }
      if (ghost.current) {
        ghost.current.style.transform = ghostPose.current.transform
        ghost.current.style.opacity = ghostPose.current.opacity
      }
      stageScroll.p = p
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

  useEffect(() => { setModelReady(false) }, [active])

  // `live` turns on after the last draw, so the fresh wrapper needs the pose now
  useEffect(() => {
    if (!ghost.current || !ghostPose.current.transform) return
    ghost.current.style.transform = ghostPose.current.transform
    ghost.current.style.opacity = ghostPose.current.opacity
  })

  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const ring = pick(COPY.stage.ring, lang).repeat(3)
  const live = gl && inView && !!PRODUCTS[active].model && !detail

  return (
    <section ref={section} id="top" className="relative" style={{ height: `${PRODUCTS.length * 78}svh` }}>
      <div
        ref={pin}
        className="relative h-[100svh] overflow-hidden"
        onPointerMove={(e) => setCursor((c) => ({ ...c, x: e.clientX, y: e.clientY }))}
      >
        {/* the plinth: a background shape, so it may bleed past the edges */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-[33%] md:top-[40%]">
          <svg viewBox="0 0 1000 620" preserveAspectRatio={narrow ? 'xMidYMid meet' : 'xMidYMax slice'} className="h-full w-full">
            <defs>
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
          </svg>
        </div>

        {/* the ring of brand words turns behind the packs. It gets its own
            square canvas centred on the pack anchor: inside the plinth's svg it
            was sliced, and a half-cut word reads as broken type, not as motion. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[55%] z-[1] -translate-x-1/2 -translate-y-1/2 md:top-[62%]"
          style={{ width: 'min(80vw, 52svh)', height: 'min(80vw, 52svh)' }}
        >
          <svg viewBox="0 0 620 620" className="h-full w-full">
            <defs>
              <path id="barc-ring" d="M310,310 m-268,0 a268,268 0 1,1 536,0 a268,268 0 1,1 -536,0" />
            </defs>
            <g ref={ringRef} style={{ transformOrigin: '310px 310px', transition: 'transform .1s linear' }}>
              {/* textLength pins the words to the exact circumference (2πr),
                  so the pattern closes on itself instead of being clipped
                  mid-word where the path ends — and it re-fits per language. */}
              <text fill="var(--accent)" fontSize="27" style={{ fontFamily: 'var(--font-brand)', fontWeight: 800, opacity: 0.6 }}>
                <textPath href="#barc-ring" startOffset="0%" textLength={2 * Math.PI * 268} lengthAdjust="spacing">
                  {ring}
                </textPath>
              </text>
            </g>
          </svg>
        </div>

        {/* the packs */}
        <div className="absolute left-1/2 top-[55%] z-10 h-0 w-0 md:top-[62%]">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.slug}
              ref={(el) => { items.current[i] = el }}
              className="absolute left-0 top-0 w-[clamp(116px,13vw,196px)] cursor-pointer will-change-transform"
              onPointerEnter={() => setCursor((c) => ({ ...c, on: true }))}
              onPointerLeave={() => setCursor((c) => ({ ...c, on: false }))}
              onClick={() => setDetail(p)}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full object-contain transition-opacity duration-300"
                style={{ maxWidth: 'none', opacity: live && modelReady && active === i ? 0 : 1 }}
                loading={i < 3 ? 'eager' : 'lazy'}
              />
              {!p.available && (
                <span
                  className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-[0.3rem] text-[0.62rem] font-semibold uppercase tracking-[0.16em]"
                  style={{
                    color: 'var(--fg-mute)',
                    background: 'color-mix(in srgb, var(--fg) 10%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--fg) 24%, transparent)'
                  }}
                >
                  {pick(COPY.chain.soon, lang)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* the live model sits exactly where the centre pack is */}
        {live && (
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] z-[5] h-0 w-0 md:top-[62%]">
            <div
              ref={ghost}
              className="absolute left-0 top-0 will-change-transform"
              style={{ width: 'clamp(240px,27vw,420px)', height: 'clamp(300px,34vw,520px)' }}
            >
              <StagePack
                src={PRODUCTS[active].model!}
                texture={PRODUCTS[active].image}
                tint={PRODUCTS[active].tint}
                active
                onReady={() => setModelReady(true)}
              />
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-[clamp(72px,10vh,120px)] z-20 px-5 text-center">
          <h1 className="display mx-auto max-w-[16ch] text-[clamp(2.1rem,7.6vw,6.4rem)] uppercase">
            <span className="block">{pick(COPY.hero.line1, lang)}</span>
            <span className="block italic" style={{ color: 'var(--accent)' }}>{pick(COPY.hero.line2, lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[34ch] text-[clamp(.88rem,1.5vw,1.04rem)]" style={{ color: 'var(--fg-mute)' }}>
            {pick(COPY.hero.sub, lang)}
          </p>
        </div>

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

      <ProductPanel product={detail} onClose={() => setDetail(null)} />
    </section>
  )
}
