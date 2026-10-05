'use client'
import { useEffect, useState } from 'react'
import { COPY, pick, LANGS } from '@/lib/copy'
import { useLang } from './LangContext'
import Wordmark from './Wordmark'
import Roll from './Roll'

const LINKS = [
  { href: '#system', k: 'system' as const },
  { href: '#range', k: 'range' as const },
  { href: '#formula', k: 'formula' as const },
  { href: '#contact', k: 'contact' as const }
]

export default function Navbar() {
  const { lang, setLang } = useLang()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid((window.scrollY || 0) > 30)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [open])

  return (
    <>
      {/* a separate ground layer that fades in once the stage is behind us */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[clamp(68px,9vh,96px)]"
        style={{
          background: 'color-mix(in srgb, var(--bg) 80%, transparent)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
          opacity: solid && !open ? 1 : 0,
          transition: 'opacity .8s var(--ease-expo)'
        }}
      />

      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between"
        style={{ padding: 'calc(var(--sa-top) + clamp(16px,2.4vw,30px)) clamp(16px,2.4vw,30px)' }}
      >
        {/* language: four circles where there is room, one that opens on phones */}
        <div className="pointer-events-auto relative flex gap-1.5">
          <div className="hidden gap-1.5 md:flex">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-pressed={l.code === lang}
                className="grid h-9 w-9 place-items-center rounded-full font-mono text-[0.72rem] tracking-[0.06em] transition-colors duration-500"
                style={l.code === lang
                  ? { background: 'var(--accent)', color: '#2A0846', border: '1px solid var(--accent)' }
                  : { color: 'var(--fg)', border: '1px solid color-mix(in srgb, var(--fg) 28%, transparent)' }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setLangOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full font-mono text-[0.72rem] md:hidden"
            style={{ background: 'var(--accent)', color: '#2A0846', border: '1px solid var(--accent)' }}
            aria-expanded={langOpen}
            aria-label="Language"
          >
            {LANGS.find((l) => l.code === lang)?.label}
          </button>

          {langOpen && (
            <div className="absolute start-0 top-full mt-2 flex gap-1.5 md:hidden">
              {LANGS.filter((l) => l.code !== lang).map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false) }}
                  className="grid h-9 w-9 place-items-center rounded-full font-mono text-[0.72rem]"
                  style={{ color: 'var(--fg)', background: 'var(--bg-2)', border: '1px solid color-mix(in srgb, var(--fg) 28%, transparent)' }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* the mark, centred */}
        <a href="#top" className="pointer-events-auto absolute left-1/2 -translate-x-1/2 no-flip" aria-label="BÄRC">
          <Wordmark size="1.35rem" />
        </a>

        <button
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex items-center gap-2 rounded-full ps-4 pe-1.5 py-1.5 text-[0.76rem] font-semibold uppercase tracking-[0.04em] transition-colors duration-500 md:ps-5 md:pe-2 md:py-2 md:text-[0.82rem]"
          style={{ color: 'var(--fg)', border: '1px solid color-mix(in srgb, var(--fg) 28%, transparent)' }}
          aria-expanded={open}
        >
          <Roll text={pick(COPY.stage.menu, lang)} />
          <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: 'var(--accent)' }}>
            <span style={{ width: 7, height: 7, borderRadius: 1, background: '#2A0846', transform: 'rotate(45deg)' }} />
          </span>
        </button>
      </header>

      {/* full-page nav */}
      <div
        className="fixed inset-0 z-[60] flex flex-col"
        style={{
          background: 'var(--violet, #7B3FBF)',
          transform: open ? 'translateZ(0)' : 'translate3d(0,-100%,0)',
          visibility: open ? 'visible' : 'hidden',
          transition: open
            ? 'transform .9s var(--ease-premium), visibility 0s linear 0s'
            : 'transform .975s var(--ease-premium), visibility 0s linear .975s'
        }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-end" style={{ padding: 'calc(var(--sa-top) + clamp(16px,2.4vw,30px)) clamp(16px,2.4vw,30px)' }}>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-full ps-5 pe-2 py-2 font-semibold text-[0.82rem] uppercase tracking-[0.04em]"
            style={{ color: '#fff', border: '1px solid rgba(255,255,255,.4)' }}
          >
            {open ? <Roll text={pick(COPY.stage.close, lang)} /> : pick(COPY.stage.close, lang)}
            <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: '#fff' }}>
              <span style={{ width: 9, height: 1.5, background: '#2A0846', transform: 'rotate(45deg)', position: 'absolute' }} />
              <span style={{ width: 9, height: 1.5, background: '#2A0846', transform: 'rotate(-45deg)' }} />
            </span>
          </button>
        </div>

        <nav className="wrap flex flex-1 flex-col justify-center gap-0 pb-16" aria-label="Menu">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-4 border-t py-5 md:py-7"
              style={{ borderColor: 'rgba(255,255,255,.26)', color: '#fff' }}
            >
              <span className="marker" style={{ background: '#fff' }} />
              <span className="display text-[clamp(2rem,6.4vw,4.6rem)]" style={{ color: '#fff' }}>
                {open ? <Roll text={pick(COPY.nav[l.k], lang)} delay={160 + i * 70} /> : pick(COPY.nav[l.k], lang)}
              </span>
            </a>
          ))}

          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn btn-pink mt-10 self-start"
          >
            {pick(COPY.nav.cta, lang)}
          </a>
        </nav>
      </div>
    </>
  )
}
