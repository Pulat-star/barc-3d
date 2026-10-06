'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { asset } from '@/lib/products'
import { COPY, LANGS, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import Roll from '@/components/ui/Roll'
import CloseIcon from '@/components/ui/CloseIcon'

/**
 * BÄRC/Header — links left, the logo badge centred, the menu trigger right.
 * The design has no language switcher in the bar itself, so the four languages
 * live inside the overlay where there is room to label them.
 */
export default function Header({ tone = 'ink' }: { tone?: 'ink' | 'white' }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const nav = COPY.site.nav
  const ink = tone === 'white' ? 'var(--white)' : 'var(--ink)'

  // the overlay owns the scroll while it is up
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    { href: '/products/', label: pick(nav.products, lang) },
    { href: '/usage/', label: pick(nav.usage, lang) },
    { href: '/about/', label: pick(nav.about, lang) }
  ]

  return (
    <>
      <header
        className="absolute inset-x-0 top-0 z-40 h-[88px] md:h-[100px]"
        style={{ paddingTop: 'var(--sa-top)' }}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-12">
          <nav className="flex items-start gap-5 text-[14px] md:gap-[30px]" style={{ color: ink }}>
            <Link href="/products/" className="group tap leading-[16.8px]">
              <Roll text={pick(nav.products, lang)} />
            </Link>
            <Link href="/usage/" className="group tap hidden leading-[24px] sm:block">
              <Roll text={pick(nav.usage, lang)} />
            </Link>
          </nav>

          <Link href="/" aria-label="BÄRC" className="shrink-0">
            <img
              src={asset('barc-logo.png')}
              alt="BÄRC"
              width={64}
              height={64}
              className="size-[52px] rounded-[12px] md:size-[64px]"
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-[14px] leading-[16.8px]"
            style={{ color: ink }}
          >
            {pick(nav.menu, lang)}
            <span aria-hidden className="text-[15px] leading-none">☰</span>
          </button>
        </div>
      </header>

      {/* full-page overlay: .9s to open, .975s to close, so the eye catches up */}
      <div
        className="fixed inset-0 z-50 flex flex-col"
        aria-hidden={!open}
        style={{
          background: 'var(--grape)',
          transform: open ? 'translate3d(0,0,0)' : 'translate3d(0,-100%,0)',
          transition: `transform ${open ? '.9s' : '.975s'} var(--ease-page)`,
          visibility: open ? 'visible' : 'hidden',
          transitionProperty: 'transform, visibility',
          paddingTop: 'var(--sa-top)',
          paddingBottom: 'var(--sa-bot)'
        }}
      >
        <div className="mx-auto flex h-[88px] w-full max-w-[1440px] shrink-0 items-center justify-between px-6 md:h-[100px] md:px-12">
          <div className="flex gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className="grid size-9 place-items-center rounded-full text-[12px] font-semibold transition-colors duration-200"
                style={
                  l.code === lang
                    ? { background: 'var(--white)', color: 'var(--grape)' }
                    : { border: '1px solid rgba(255,255,255,.4)', color: 'var(--white)' }
                }
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-[14px] font-semibold"
            style={{ color: 'var(--white)' }}
          >
            {pick(nav.close, lang)}
            <CloseIcon bg="var(--white)" ink="var(--grape)" />
          </button>
        </div>

        <nav className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center gap-2 px-6 md:px-12">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-5 border-t py-5 md:py-7"
              style={{ borderColor: 'rgba(255,255,255,.22)' }}
            >
              <span
                className="marker"
                style={{ background: 'var(--white)' }}
              />
              <span
                className="display text-[clamp(2.2rem,8vw,5.5rem)]"
                style={{ color: 'var(--white)' }}
              >
                <Roll text={l.label} on={open} delay={i * 60} />
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
