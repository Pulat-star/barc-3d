'use client'
import { useEffect, useState } from 'react'
import { COPY, pick } from '@/lib/copy'
import { useLang } from './LangContext'

const LINKS = [
  { href: '#system', k: 'system' as const },
  { href: '#range', k: 'range' as const },
  { href: '#formula', k: 'formula' as const },
  { href: '#contact', k: 'contact' as const }
]

export default function Navbar() {
  const { lang, toggle } = useLang()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid((window.scrollY || 0) > 30)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? 'backdrop-blur-xl' : ''
      }`}
      style={{
        paddingTop: 'calc(0.9rem + var(--sa-top))',
        paddingBottom: '0.9rem',
        background: solid ? 'color-mix(in srgb, var(--bg) 72%, transparent)' : 'transparent',
        borderBottom: solid ? '1px solid color-mix(in srgb, var(--fg) 10%, transparent)' : '1px solid transparent'
      }}
    >
      <div className="wrap flex items-center justify-between gap-6">
        <a href="#top" className="font-display text-[1.35rem] font-normal tracking-tight">
          Bärc
        </a>

        <nav className="hidden items-center gap-8 text-[0.9rem] font-medium md:flex" style={{ color: 'var(--fg-mute)' }}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:[color:var(--fg)]">
              {pick(COPY.nav[l.k], lang)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggle}
            className="font-mono text-[0.68rem] tracking-[0.14em] uppercase px-2.5 py-1.5 rounded-full transition-colors"
            style={{ color: 'var(--fg-mute)', border: '1px solid color-mix(in srgb, var(--fg) 16%, transparent)' }}
            aria-label="Language"
          >
            {lang === 'en' ? 'EN' : 'UZ'}
          </button>
          <a href="#contact" className="btn btn-pink hidden sm:inline-flex !px-5 !py-2.5 !text-[0.84rem]">
            {pick(COPY.nav.cta, lang)}
          </a>
          <button
            className="btn btn-line !px-4 !py-2.5 !text-[0.82rem] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="wrap md:hidden"
          style={{ paddingTop: '0.9rem' }}
        >
          <div
            className="grid gap-1 rounded-3xl p-5"
            style={{ background: 'var(--bg-2)', border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)' }}
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-[1.4rem] font-light py-1.5"
              >
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
