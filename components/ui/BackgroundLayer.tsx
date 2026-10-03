'use client'
import { useEffect, useRef } from 'react'

/**
 * A single fixed surface for the entire page. Sections never paint their own
 * background — they sit on this one, which drifts continuously with scroll so
 * there is never a hard edge between sections.
 */
type Stop = { at: number; bg: string; bg2: string; fg: string; mute: string }

const STOPS: Stop[] = [
  { at: 0.00, bg: '#F7F6F4', bg2: '#EFEDE8', fg: '#141317', mute: '#6E6A75' },
  { at: 0.30, bg: '#F1EEE9', bg2: '#E6E2DB', fg: '#161419', mute: '#6B6772' },
  { at: 0.55, bg: '#E7E3DD', bg2: '#D9D4CC', fg: '#161419', mute: '#625E69' },
  { at: 0.78, bg: '#2B2830', bg2: '#201E25', fg: '#F6F4F1', mute: '#A49FAD' },
  { at: 1.00, bg: '#141317', bg2: '#0E0D11', fg: '#F6F4F1', mute: '#9E99A8' }
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
        style={{ background: 'radial-gradient(circle, rgba(232,53,138,.30), transparent 62%)', filter: 'blur(14px)' }}
      />
      {/* paper grain — keeps the flat neutral ground from looking like dead CSS */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px'
        }}
      />
    </div>
  )
}
