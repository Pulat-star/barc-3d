'use client'
import { useEffect, useRef, useState } from 'react'
import { COPY, pick, LANGS } from '@/lib/copy'
import { useLang } from './LangContext'
import Wordmark from './Wordmark'

const LINKS = [
  { href: '#system', k: 'system' as const },
  { href: '#range', k: 'range' as const },
  { href: '#formula', k: 'formula' as const },
  { href: '#contact', k: 'contact' as const }
]

export default function Navbar() {
  const { lang, setLang } = useLang()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [light, setLight] = useState(false)
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let last = window.scrollY || 0
    const on = () => {
      const y = window.scrollY || 0
      setSolid(y > 30)
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 120)
        last = y
      }
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // the one light section in a dark page flips the bar to dark ink
  useEffect(() => {
    const marks = document.querySelectorAll('[data-nav="light"]')
    if (!marks.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setLight(e.isIntersecting)),
      { rootMargin: '0px 0px -94% 0px' }
    )
    marks.forEach((m) => io.observe(m))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!langOpen) return
    const away = (e: MouseEvent) => {
      if (!langBox.current?.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [langOpen])

  const current = LANGS.find((l) => l.code === lang)!

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? 'backdrop-blur-xl' : ''}`}
      data-light={light || undefined}
      style={{
        paddingTop: 'calc(0.85rem + var(--sa-top))',
        paddingBottom: '0.85rem',
        background: solid ? (light ? 'rgba(246,241,234,.82)' : 'color-mix(in srgb, var(--bg) 78%, transparent)') : 'transparent',
        borderBottom: solid ? '1px solid color-mix(in srgb, var(--fg) 14%, transparent)' : '1px solid transparent',
        color: light ? '#2A0846' : 'var(--fg)'
      }}
    >
      <div className="wrap flex items-center justify-between gap-5">
        <a href="#top" className="no-flip shrink-0"><Wordmark size="1.3rem" /></a>

        <nav
          className="hidden items-center gap-7 text-[0.9rem] font-medium lg:flex"
          style={{ color: light ? '#6B5A86' : 'var(--fg-mute)' }}
        >
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-[transform,opacity] duration-500"
              style={{
                transitionTimingFunction: 'var(--ease)',
                transitionDelay: `${i * 25}ms`,
                transform: hidden ? 'translateY(-220%)' : 'none',
                opacity: hidden ? 0 : 1
              }}
            >
              {pick(COPY.nav[l.k], lang)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative" ref={langBox}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="font-mono text-[0.76rem] tracking-[0.14em] uppercase px-2.5 py-1.5 rounded-full transition-colors"
              style={{ color: 'inherit', border: '1px solid color-mix(in srgb, currentColor 30%, transparent)' }}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              {current.label}
            </button>
            {langOpen && (
              <div
                role="listbox"
                className="absolute end-0 top-full mt-2 grid min-w-[5.2rem] gap-0.5 rounded-2xl p-1.5"
                style={{ background: 'var(--bg-2)', border: '1px solid color-mix(in srgb, var(--fg) 18%, transparent)' }}
              >
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    role="option"
                    aria-selected={l.code === lang}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className="rounded-xl px-3 py-1.5 text-start font-mono text-[0.76rem] tracking-[0.14em] transition-colors"
                    style={{
                      background: l.code === lang ? 'var(--accent)' : 'transparent',
                      color: l.code === lang ? '#2A0846' : 'var(--fg)'
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a href="#contact" className="btn btn-pink hidden sm:inline-flex !px-5 !py-2.5 !text-[0.84rem]">
            {pick(COPY.nav.cta, lang)}
          </a>
          <button
            className="btn btn-line !px-3.5 !py-2.5 !text-[0.82rem] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="wrap lg:hidden" style={{ paddingTop: '0.85rem' }}>
          <div
            className="grid gap-1 rounded-3xl p-5"
            style={{ background: 'var(--bg-2)', border: '1px solid color-mix(in srgb, var(--fg) 16%, transparent)' }}
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="display py-1.5 text-[1.4rem]">
                {pick(COPY.nav[l.k], lang)}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-pink mt-3">
              {pick(COPY.nav.cta, lang)}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
