'use client'
import { useEffect, useRef } from 'react'

/**
 * A single fixed surface for the entire page. Sections never paint their own
 * background — they sit on this one, which drifts continuously with scroll so
 * there is never a hard edge between sections.
 */
type Stop = { at: number; bg: string; bg2: string; fg: string; mute: string }

const STOPS: Stop[] = [
  { at: 0.00, bg: '#2E0A4F', bg2: '#4A1578', fg: '#FFFFFF', mute: '#C7B0E8' },
  { at: 0.28, bg: '#360C5C', bg2: '#56198A', fg: '#FFFFFF', mute: '#CDB7EC' },
  { at: 0.55, bg: '#3E1069', bg2: '#61209B', fg: '#FFFFFF', mute: '#D2BEEF' },
  { at: 0.80, bg: '#28083F', bg2: '#3C1063', fg: '#FFFFFF', mute: '#BCA3E2' },
  { at: 1.00, bg: '#1C0733', bg2: '#2B0A4A', fg: '#FFFFFF', mute: '#B296DD' }
]

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const toHex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const mix = (a: string, b: string, t: number) => {
  const x = hex(a), y = hex(b)
  return toHex(x.map((v, i) => v + (y[i] - v) * t))
}

export default function BackgroundLayer() {
  const glow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let last = -1

    const frame = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const p = Math.min(1, Math.max(0, (window.scrollY || 0) / max))

      if (Math.abs(p - last) > 0.0008) {
        last = p
        let i = 0
        while (i < STOPS.length - 2 && p > STOPS[i + 1].at) i++
        const a = STOPS[i], b = STOPS[i + 1]
        const t = Math.min(1, Math.max(0, (p - a.at) / (b.at - a.at)))

        root.style.setProperty('--bg', mix(a.bg, b.bg, t))
        root.style.setProperty('--bg-2', mix(a.bg2, b.bg2, t))
        root.style.setProperty('--fg', mix(a.fg, b.fg, t))
        root.style.setProperty('--fg-mute', mix(a.mute, b.mute, t))

        if (glow.current) {
          glow.current.style.transform =
            `translate3d(${(-20 + p * 44).toFixed(2)}%, ${(14 + Math.sin(p * Math.PI * 1.4) * 26).toFixed(2)}%, 0)`
          glow.current.style.opacity = String(0.28 + Math.sin(p * Math.PI) * 0.3)
        }
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 50% 0%, var(--bg-2), transparent 70%)' }}
      />
      <div
        ref={glow}
        className="absolute left-1/4 top-0 h-[85vmax] w-[85vmax] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(249,184,31,.16), rgba(155,78,230,.26) 42%, transparent 66%)', filter: 'blur(14px)' }}
      />
      {/* paper grain — keeps the flat neutral ground from looking like dead CSS */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px'
        }}
      />
    </div>
  )
}
