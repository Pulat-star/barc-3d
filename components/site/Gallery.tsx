'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'

/** Only the three released scents ride the gallery. */
const SHOWN = PRODUCTS.filter((p) => p.available)

/**
 * The home gallery: one pack centred on the dome, its neighbours tilted away
 * and cropped by the viewport. Drag, arrows and the keyboard all move the same
 * index, and the packs transition between slots rather than being re-laid out,
 * so the move reads as one object travelling.
 */
export default function Gallery() {
  const { lang } = useLang()
  const site = COPY.site
  const [active, setActive] = useState(0)
  const n = SHOWN.length
  const drag = useRef<{ x: number; on: boolean }>({ x: 0, on: false })

  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const onDown = (x: number) => { drag.current = { x, on: true } }
  const onUp = (x: number) => {
    if (!drag.current.on) return
    const dx = x - drag.current.x
    drag.current.on = false
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  const product = SHOWN[active]
  const scent = site.scent[product.slug]

  return (
    <section
      className="relative select-none [--slot:46vw] md:[--slot:24vw]"
      onPointerDown={(e) => onDown(e.clientX)}
      onPointerUp={(e) => onUp(e.clientX)}
      onPointerCancel={() => { drag.current.on = false }}
    >
      {/* the dome: a single ellipse bleeding past both edges */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] -z-0"
          style={{
            // one ellipse, wider than the viewport so only its crown shows
            left: '-12.5vw', right: '-12.5vw',
            background: 'var(--grape)',
            borderRadius: '50% 50% 0 0 / 38% 38% 0 0'
          }}
        />

        {/* the packs. 350 of the design's 480 belong to them, the rest to the
            caption that sits over the dome underneath */}
        <div className="relative mx-auto h-[clamp(220px,24.3vw,350px)] max-w-[1440px]">
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
                  // sized by height, not width: the design's slots are 350 and
                  // 270 tall, and a width-driven pouch overflows its row and
                  // gets its child-lock strip clipped off the top
                  height: lead ? '100%' : '78%',
                  // --slot is the gap between slots: wide on phones so the
                  // neighbours crop against the screen edge as they do in the
                  // design, narrower on desktop where all three fit
                  transform: `translate3d(calc(-50% + ${o} * var(--slot)), ${lead ? 0 : -4}%, 0) rotate(${o * 12}deg)`,
                  opacity: lead ? 1 : 0.9,
                  zIndex: lead ? 2 : 1,
                  transition: 'transform .9s var(--ease-page), opacity .42s linear, height .9s var(--ease-page)'
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
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
        <div className="relative z-[3] flex flex-col items-center gap-2 pb-10 pt-4 text-center md:pb-14">
          <h2 key={product.slug} className="display text-[clamp(1.8rem,3.4vw,2.4rem)]" style={{ color: 'var(--white)' }}>
            {product.name}
          </h2>
          <p className="text-[13px] leading-[18.2px]" style={{ color: 'rgba(255,255,255,.88)' }}>
            {scent && pick(scent, lang)} · {pick(site.products.units, lang)}
          </p>
          <Link href={`/products/${product.slug}/`} className="btn btn-white mt-3">
            {pick(site.home.discover, lang)}
          </Link>
        </div>
      </div>

      {/* controls */}
      <div
        className="flex items-center justify-between px-6 py-5 md:px-12"
        style={{ background: 'var(--grape)', color: 'var(--white)' }}
      >
        <p className="whitespace-pre-line text-[12px] leading-[16.8px]" style={{ color: 'rgba(255,255,255,.8)' }}>
          {pick(site.home.rotate, lang)}
        </p>

        <div className="flex items-center gap-5 text-[17px] font-semibold">
          <button type="button" onClick={() => go(-1)} aria-label="previous" className="grid size-11 place-items-center">‹</button>
          <span className="tabular-nums">{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <button type="button" onClick={() => go(1)} aria-label="next" className="grid size-11 place-items-center">›</button>
        </div>

        <div className="flex items-center gap-1.5">
          {SHOWN.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-label={p.name}
              // the bar is 2px, but the button keeps a thumb-sized hit area:
              // the global coarse-pointer rule would otherwise inflate the bar
              // itself into a block
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
      <div className="flex items-center justify-between px-6 py-5 text-[12px] md:px-12" style={{ background: 'var(--paper)' }}>
        <p style={{ color: 'var(--muted)' }}>{pick(site.home.format, lang)}</p>
        <Link href="/products/" className="group tap inline-flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <span className="marker" />
          {pick(site.home.all, lang)}
        </Link>
      </div>
    </section>
  )
}
