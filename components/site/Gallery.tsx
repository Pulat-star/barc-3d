'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { RELEASED } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/masterTimeline'

/** Only the released scents ride the gallery. */
const SHOWN = RELEASED

/**
 * The home screen, pinned.
 *
 * Scrolling does not move the page — it turns the carousel, as on the
 * reference. The section is one screen tall per product; that run of scroll is
 * consumed in place and the progress through it decides which pack leads.
 * Arrows and the indicators scroll to the matching position rather than setting
 * state directly, so there is one source of truth and they can never disagree
 * with the scrollbar.
 */
export default function Gallery() {
  const { lang } = useLang()
  const site = COPY.site
  const home = site.home
  const n = SHOWN.length

  const section = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    registerGsap()
    const sec = section.current
    const pinEl = pin.current
    if (!sec || !pinEl) return
    // without the pin there is no scroll to read, so the arrows drive state
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      trigger.current = ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinEl,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(n - 1, Math.floor(self.progress * n))
          setActive((prev) => (prev === i ? prev : i))
        }
      })
    }, sec)

    return () => { trigger.current = null; ctx.revert() }
  }, [n])

  /** Scroll to the middle of slot `i`; the trigger then sets the state. */
  const goTo = useCallback((i: number) => {
    const st = trigger.current
    const next = (i + n) % n
    if (!st) { setActive(next); return }
    const y = st.start + (st.end - st.start) * ((next + 0.5) / n)
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }, [n])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(active + 1)
      if (e.key === 'ArrowLeft') goTo(active - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, active])

  const product = SHOWN[active]
  const scent = site.scent[product.slug]

  return (
    <section
      ref={section}
      className="relative [--slot:46vw] md:[--slot:24vw]"
      style={{ height: `${n * 100}svh` }}
    >
      <div ref={pin} className="relative flex h-[100svh] select-none flex-col overflow-hidden">
        {/* the slogan stays put while the packs turn underneath it */}
        <div
          className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[14px] px-6 text-center md:gap-[18px] md:px-12"
          style={{ paddingTop: 'calc(88px + var(--sa-top) + 1.75rem)' }}
        >
          <p className="eyebrow" data-rv>{pick(home.eyebrow, lang)}</p>
          <h1 className="display mx-auto max-w-[1100px] text-[clamp(2.1rem,6.4vw,5.75rem)]">
            <span className="line"><span className="line__i">{pick(home.s1, lang)}</span></span>
            <span className="line">
              <span className="line__i" style={{ ['--d' as string]: '80ms' }}>
                <span className="italic" style={{ color: 'var(--accent)' }}>{pick(home.s2, lang)}</span>
                {pick(home.s3, lang)}
              </span>
            </span>
          </h1>
          <p className="lede max-w-[800px]" data-rv style={{ ['--d' as string]: '160ms' }}>
            {pick(home.promise, lang)}
          </p>
          {/* the extra line only appears where there is height to spare, so it
              can never crowd the pack */}
          <p
            className="lede hidden max-w-[62ch] [@media(min-height:860px)]:block"
            data-rv
            style={{ ['--d' as string]: '220ms' }}
          >
            {pick(home.note, lang)}
          </p>
        </div>

        {/* the dome: a single ellipse bleeding past both edges */}
        <div className="relative flex-1">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 top-[44%]"
            style={{
              left: '-12.5vw', right: '-12.5vw',
              background: 'var(--grape)',
              borderRadius: '50% 50% 0 0 / 38% 38% 0 0'
            }}
          />

          {/* the packs */}
          <div className="relative mx-auto h-[62%] max-w-[1440px]">
            {SHOWN.map((p, i) => {
              // -1, 0, +1 around the active slot, wrapping both ways
              let o = i - active
              if (o > n / 2) o -= n
              if (o < -n / 2) o += n
              const lead = o === 0
              return (
                <div
                  key={p.slug}
                  className="absolute bottom-0 left-1/2 will-change-transform"
                  style={{
                    // sized by height, not width: a width-driven pouch overflows
                    // its row and loses the child-lock strip off the top
                    height: lead ? '100%' : '78%',
                    transform: `translate3d(calc(-50% + ${o} * var(--slot)), ${lead ? 0 : -4}%, 0) rotate(${o * 12}deg)`,
                    opacity: lead ? 1 : 0.9,
                    zIndex: lead ? 2 : 1,
                    transition: 'transform .9s var(--ease-page), opacity .42s linear, height .9s var(--ease-page)'
                  }}
                >
                  <img
                    src={p.images.front}
                    alt={`BÄRC ${p.name} — 3in1 PODS kir yuvish kapsulalari`}
                    className="depth h-full w-auto object-contain"
                    style={{ maxWidth: 'none' }}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    draggable={false}
                  />
                </div>
              )
            })}
          </div>

          {/* caption, on the dome */}
          <div className="relative z-[3] mt-2 flex flex-col items-center gap-1.5 text-center md:mt-3 md:gap-2">
            <h2 className="display text-[clamp(1.6rem,3.4vw,2.4rem)]" style={{ color: 'var(--white)' }}>
              {product.name}
            </h2>
            <p className="text-[13px] leading-[18.2px]" style={{ color: 'rgba(255,255,255,.88)' }}>
              {scent && pick(scent, lang)} · {product.quantity} {pick(site.products.units, lang)}
            </p>
            <Link href={`/mahsulotlar/${product.slug}/`} className="btn btn-white mt-2">
              {pick(home.discover, lang)}
            </Link>
          </div>
        </div>

        {/* controls */}
        <div
          className="flex shrink-0 items-center justify-between px-6 py-4 md:px-12 md:py-5"
          style={{ background: 'var(--grape)', color: 'var(--white)' }}
        >
          <p className="whitespace-pre-line text-[12px] leading-[16.8px]" style={{ color: 'rgba(255,255,255,.8)' }}>
            {pick(home.rotate, lang)}
          </p>

          <div className="flex items-center gap-4 text-[17px] font-semibold md:gap-5">
            <button type="button" onClick={() => goTo(active - 1)} aria-label="previous" className="grid size-11 place-items-center">‹</button>
            <span className="tabular-nums">{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
            <button type="button" onClick={() => goTo(active + 1)} aria-label="next" className="grid size-11 place-items-center">›</button>
          </div>

          <div className="flex items-center gap-1.5">
            {SHOWN.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={p.name}
                // the bar is 2px, but the button keeps a thumb-sized hit area:
                // the global coarse-pointer rule would otherwise inflate the bar
                className="grid h-11 place-items-center px-1"
              >
                <span
                  className="block h-[2px] rounded-full transition-all duration-500"
                  style={{
                    width: i === active ? 26 : 12,
                    background: i === active ? 'var(--white)' : 'rgba(255,255,255,.45)',
                    transitionTimingFunction: 'var(--ease-page)'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* the strip under the controls */}
        <div
          className="flex shrink-0 items-center justify-between gap-4 px-6 py-3 text-[12px] md:px-12"
          style={{ background: 'var(--paper)', paddingBottom: 'calc(1rem + var(--sa-bot))' }}
        >
          <p style={{ color: 'var(--muted)' }}>{pick(home.format, lang)}</p>
          <Link href="/mahsulotlar/" className="btn btn-grape">
            {pick(home.cta, lang)}
          </Link>
        </div>
      </div>
    </section>
  )
}
