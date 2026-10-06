'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { RELEASED } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'

/** Only the released scents ride the gallery. */
const SHOWN = RELEASED

/**
 * The home gallery, as the Figma frame draws it: one pack centred on the dome,
 * its neighbours tilted away and cropped by the viewport.
 *
 * Scrolling is left alone — the page scrolls normally and the carousel is moved
 * by the arrows, the indicators, a swipe or the arrow keys. The packs transition
 * between slots rather than being re-laid out, so a change reads as one object
 * travelling rather than three being swapped.
 */
export default function Gallery() {
  const { lang } = useLang()
  const site = COPY.site
  const home = site.home
  const n = SHOWN.length

  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const drag = useRef<{ x: number; on: boolean }>({ x: 0, on: false })

  const goTo = useCallback((i: number) => setActive(((i % n) + n) % n), [n])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActive((a) => (a + 1) % n)
      if (e.key === 'ArrowLeft') setActive((a) => (a - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n])

  /**
   * Scrolling past the gallery turns it. The page is never pinned or slowed —
   * the scroll position is only read, so the carousel advances as the hero
   * leaves the screen and rewinds on the way back up.
   */
  useEffect(() => {
    const sec = section.current
    if (!sec) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const read = () => {
      frame = 0
      const top = sec.getBoundingClientRect().top + window.scrollY
      const travelled = window.scrollY - top
      // one slot per 40% of a viewport; the last slot holds while the hero
      // finishes leaving, so the third pack is never a flash
      const step = Math.max(220, window.innerHeight * 0.4)
      const i = Math.min(n - 1, Math.max(0, Math.floor(travelled / step) + 0))
      if (travelled < -window.innerHeight) return
      setActive((prev) => (prev === i ? prev : i))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    window.addEventListener('scroll', onScroll, { passive: true })
    read()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [n])

  // a swipe moves one slot; the threshold keeps a vertical scroll from counting
  const onDown = (x: number) => { drag.current = { x, on: true } }
  const onUp = (x: number) => {
    if (!drag.current.on) return
    const dx = x - drag.current.x
    drag.current.on = false
    if (Math.abs(dx) > 44) setActive((a) => (a + (dx < 0 ? 1 : -1) + n) % n)
  }

  const product = SHOWN[active]
  const scent = site.scent[product.slug]

  return (
    <section
      ref={section}
      className="relative select-none [--slot:46vw] md:[--slot:24vw]"
      onPointerDown={(e) => onDown(e.clientX)}
      onPointerUp={(e) => onUp(e.clientX)}
      onPointerCancel={() => { drag.current.on = false }}
    >
      <div className="relative flex flex-col overflow-hidden">
        {/* the slogan stays put while the packs turn underneath it */}
        <div
          className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-3 px-6 text-center md:gap-[18px] md:px-12"
          style={{ paddingTop: 'calc(88px + var(--sa-top) + 1.25rem)', paddingBottom: '0.5rem' }}
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
        </div>

        {/* The dome is the Figma ellipse, not an approximated curve: 1800x1000
            on a 1440 frame, so it overhangs 180px each side and only its crown
            shows. As fractions that is 125% wide and 285% of the pack row tall,
            with its top edge 61% of the way down that row. */}
        {/* this zone clips the dome, so the ellipse can run past the caption
            without painting over the control rows that follow */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[-12.5vw] right-[-12.5vw] top-[36%] h-[200%] rounded-[50%]"
            style={{ background: 'var(--grape)' }}
          />

          <div className="relative mx-auto h-[clamp(230px,24.5vw,352px)] max-w-[1440px]">
            {/* the packs */}
            {SHOWN.map((p, i) => {
              // -1, 0, +1 around the active slot, wrapping both ways
              let o = i - active
              if (o > n / 2) o -= n
              if (o < -n / 2) o += n
              const lead = o === 0
              return (
                <div
                  key={p.slug}
                  role={lead ? undefined : 'button'}
                  tabIndex={lead ? -1 : 0}
                  aria-label={lead ? undefined : `${p.name} — markazga olib kelish`}
                  onClick={() => { if (!lead) setActive(i) }}
                  onKeyDown={(e) => {
                    if (lead) return
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i) }
                  }}
                  className={`absolute bottom-0 left-1/2 will-change-transform ${lead ? '' : 'cursor-pointer'}`}
                  style={{
                    // sized by height, not width: a width-driven pouch overflows
                    // its row and loses the child-lock strip off the top
                    height: lead ? '100%' : '77%',
                    transform: `translate3d(calc(-50% + ${o} * var(--slot)), ${lead ? 0 : -4}%, 0) rotate(${o * 12}deg)`,
                    opacity: lead ? 1 : 0.9,
                    zIndex: lead ? 2 : 1,
                    transition: 'transform .9s var(--ease-page), opacity .42s linear, height .9s var(--ease-page)'
                  }}
                >
                  {lead ? (
                    <Link href={`/mahsulotlar/${p.slug}/`} aria-label={`${p.name} sahifasi`} className="block h-full">
                      <img
                        src={p.images.front}
                        alt={`BÄRC ${p.name} — 3in1 PODS kir yuvish kapsulalari`}
                        className="depth h-full w-auto object-contain"
                        style={{ maxWidth: 'none' }}
                        loading="eager"
                        draggable={false}
                      />
                    </Link>
                  ) : (
                    <img
                      src={p.images.front}
                      alt={`BÄRC ${p.name} — 3in1 PODS kir yuvish kapsulalari`}
                      className="depth h-full w-auto object-contain"
                      style={{ maxWidth: 'none' }}
                      loading="lazy"
                      draggable={false}
                    />
                  )}
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
              {scent && pick(scent, lang)} · {product.quantity} {pick(site.products.units, lang).split('·')[0].trim()}
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
          <Link href="/mahsulotlar/" className="group tap inline-flex items-center gap-2" style={{ color: 'var(--ink)' }}>
            <span className="marker" />
            {pick(home.all, lang)}
          </Link>
        </div>
      </div>
    </section>
  )
}
