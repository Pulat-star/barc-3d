'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals, revealIn } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/masterTimeline'
import { packScroll } from '@/lib/packScroll'

const PackViewer = dynamic(() => import('@/components/ui/PackViewer'), { ssr: false })
const MODELLED = PRODUCTS.filter((p) => p.model)

/**
 * A pinned product film. Scroll is the transport: it turns the pack, lifts it
 * through frame and steps the caption, with a frame counter and progress bar so
 * the viewer can see they are driving it.
 */
export default function Showcase3D() {
  const { lang } = useLang()
  const section = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)
  const [beat, setBeat] = useState(0)
  const [armed, setArmed] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  // a shorter film on phones: the same beats, less pinned scrolling to render
  const [filmH, setFilmH] = useState('320svh')
  useEffect(() => {
    const set = () => setFilmH(window.matchMedia('(max-width: 859px)').matches ? '230svh' : '320svh')
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])

  useEffect(() => { revealIn(pin.current); observeReveals() }, [lang, active, beat])

  useEffect(() => {
    const el = section.current
    if (!el) return
    let gl = false
    try {
      const c = document.createElement('canvas')
      gl = !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch { gl = false }
    if (!gl) return

    const arm = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setArmed(true); arm.disconnect() } }, { rootMargin: '300px 0px' })
    arm.observe(el)
    const live = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: '80px 0px' })
    live.observe(el)
    return () => { arm.disconnect(); live.disconnect() }
  }, [])

  useEffect(() => {
    registerGsap()
    const sec = section.current, pinEl = pin.current
    if (!sec || !pinEl) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { packScroll.p = 0.5; return }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinEl,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          packScroll.p = self.progress
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress.toFixed(4)})`
          if (counter.current) counter.current.textContent = String(Math.round(self.progress * 99) + 1).padStart(3, '0')
          const b = Math.min(2, Math.floor(self.progress * 3))
          setBeat((prev) => (prev === b ? prev : b))
        }
      })
    }, sec)
    return () => ctx.revert()
  }, [])

  const product = MODELLED[active]

  return (
    <section ref={section} id="pack" className="relative" style={{ height: filmH }}>
      <div ref={pin} className="relative h-[100svh] overflow-hidden">
        <div className="wrap absolute inset-0 grid items-center gap-6 md:grid-cols-2 md:gap-12">
          <div className="relative z-20 order-2 self-end pb-28 md:order-1 md:self-center md:pb-0">
            <p className="kicker" data-rv>{pick(COPY.pack.kicker, lang)}</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,4.4vw,3.4rem)]">
              <Lines lines={[pick(COPY.pack.title, lang)]} start={80} />
            </h2>
            <p className="lede mt-4">{pick(COPY.pack.lede, lang)}</p>

            {/* the caption steps with the film */}
            <p key={beat} className="mt-6 flex items-center gap-3 text-[1rem] font-semibold md:text-[1.12rem]" data-rv>
              <span className="font-mono text-[0.76rem]" style={{ color: 'var(--accent)' }} dir="ltr">
                0{beat + 1}
              </span>
              {pick(COPY.pack.beats[beat], lang)}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {MODELLED.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => setActive(i)}
                  className="rounded-full px-4 py-2 text-[0.85rem] font-semibold transition-transform duration-500 hover:-translate-y-0.5"
                  style={i === active
                    ? { background: p.tint, color: '#fff' }
                    : { border: '1px solid color-mix(in srgb, var(--fg) 26%, transparent)', color: 'var(--fg)' }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative order-1 h-[46svh] w-full md:order-2 md:h-[76svh]">
            {armed ? (
              <PackViewer src={product.model!} tint={product.tint} active={onScreen} />
            ) : (
              <img src={product.image} alt={product.name} className="absolute inset-0 m-auto max-h-[80%] w-auto object-contain" />
            )}
          </div>
        </div>

        {/* transport chrome, so the scroll feels like a playhead */}
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-7 z-30 flex items-center gap-4">
          <span className="h-[3px] w-[min(44vw,320px)] overflow-hidden rounded-full" style={{ background: 'color-mix(in srgb, var(--fg) 18%, transparent)' }}>
            <span
              ref={bar}
              className="block h-full w-full origin-left rounded-full"
              style={{ background: 'var(--accent)', transform: 'scaleX(0)' }}
            />
          </span>
          <span ref={counter} className="font-mono text-[0.76rem] tracking-[0.14em]" style={{ color: 'var(--fg-mute)' }} dir="ltr">
            001
          </span>
          <span className="ms-auto font-mono text-[0.76rem] tracking-[0.16em] uppercase" style={{ color: 'var(--fg-mute)' }}>
            {pick(COPY.pack.hint, lang)}
          </span>
        </div>
      </div>
    </section>
  )
}
