'use client'
import { useEffect } from 'react'
import type { Product } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from './LangContext'
import Roll from './Roll'
import CloseIcon from './CloseIcon'

/**
 * Tapping a pack opens its own full view, the way the reference moves from the
 * carousel to a product page: the name fills the top in display type, the pack
 * stands beneath it, and the particulars sit in the margins.
 */
export default function ProductPanel({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { lang } = useLang()
  const open = !!product

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [open, onClose])

  const origin = pick(COPY.stage.origin, lang).split('\n')

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto"
      style={{
        background: 'var(--bg)',
        transform: open ? 'translateZ(0)' : 'translate3d(0,100%,0)',
        visibility: open ? 'visible' : 'hidden',
        transition: open
          ? 'transform .9s var(--ease-premium), visibility 0s linear 0s'
          : 'transform .975s var(--ease-premium), visibility 0s linear .975s'
      }}
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
    >
      {product && (
        <div className="relative flex min-h-[100svh] flex-col">
          <div
            className="flex items-center justify-between"
            style={{ padding: 'calc(var(--sa-top) + clamp(16px,2.4vw,30px)) clamp(16px,2.4vw,30px)' }}
          >
            <span className="kicker" style={{ color: product.tint }}>
              {pick(COPY.chain.categories[product.category], lang)}
            </span>
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-full ps-4 pe-1.5 py-1.5 text-[0.76rem] font-semibold uppercase tracking-[0.04em]"
              style={{ color: 'var(--fg)', border: '1px solid color-mix(in srgb, var(--fg) 28%, transparent)' }}
            >
              {open ? <Roll text={pick(COPY.stage.close, lang)} /> : pick(COPY.stage.close, lang)}
              <CloseIcon bg="var(--accent)" />
            </button>
          </div>

          {/* the name owns the page, as on the reference's product pages */}
          <h2
            className="display px-4 text-center uppercase"
            style={{
              fontSize: 'clamp(2.6rem,11vw,10rem)',
              lineHeight: 0.92,
              color: 'var(--accent)',
              marginTop: 'clamp(.5rem,3vh,2.5rem)'
            }}
          >
            {product.name}
          </h2>

          <div className="relative mt-[clamp(1.25rem,4vh,3rem)] flex flex-1 items-start justify-center pb-10 md:items-center">
            <p
              className="absolute start-[clamp(16px,4vw,56px)] top-1/2 hidden -translate-y-1/2 font-display text-[clamp(1rem,1.7vw,1.5rem)] md:block"
              style={{ color: 'var(--fg-mute)' }}
            >
              {pick(COPY.chain.promise[product.slug], lang)}
            </p>
            <p
              className="absolute end-[clamp(16px,4vw,56px)] top-1/2 hidden -translate-y-1/2 text-end font-display text-[clamp(1rem,1.7vw,1.5rem)] leading-tight md:block"
              style={{ color: 'var(--fg-mute)' }}
            >
              {origin.map((l) => <span key={l} className="block">{l}</span>)}
            </p>

            <img
              src={product.image}
              alt={product.name}
              className="w-auto object-contain"
              style={{ maxHeight: 'min(44svh, 460px)', filter: `drop-shadow(0 30px 60px color-mix(in srgb, ${product.tint} 45%, transparent))` }}
            />
          </div>

          {/* the particulars */}
          <div className="wrap grid gap-8 pb-16 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <div>
              <p className="text-[1.1rem] font-semibold md:hidden">{pick(COPY.chain.promise[product.slug], lang)}</p>
              <p className="lede mt-2 md:mt-0">{pick(COPY.chain.detail[product.slug], lang)}</p>
              <p
                className="mt-6 inline-flex rounded-full px-3.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em]"
                style={product.available
                  ? { background: product.tint, color: '#fff' }
                  : { border: '1px solid color-mix(in srgb, var(--fg) 26%, transparent)', color: 'var(--fg-mute)' }}
              >
                {product.available ? pick(COPY.chain.available, lang) : pick(COPY.chain.soon, lang)}
              </p>
            </div>

            <div>
              <p className="kicker">{pick(COPY.stage.specs, lang)}</p>
              <dl className="mt-3">
                {[
                  [pick(COPY.stage.scent, lang), product.name],
                  [pick(COPY.stage.pack, lang), '60 · 3 in 1'],
                  [pick(COPY.stage.temp, lang), '20–40 °C']
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-4 border-t py-3.5"
                    style={{ borderColor: 'color-mix(in srgb, var(--fg) 16%, transparent)' }}
                  >
                    <dt className="font-mono text-[0.72rem] uppercase tracking-[0.14em]" style={{ color: 'var(--fg-mute)' }}>{k}</dt>
                    <dd className="text-[0.95rem] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="#contact" onClick={onClose} className="btn btn-pink mt-6 w-full">
                {pick(COPY.nav.cta, lang)}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
