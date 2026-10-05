'use client'
import { useEffect, useRef } from 'react'

/** Label whose glyphs roll up out of a mask, 18 ms apart. */
export default function Roll({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const t = window.setTimeout(() => el.classList.add('is-in'), 40 + delay)
    return () => window.clearTimeout(t)
  }, [text, delay])

  const chars = Array.from(text)
  return (
    <span ref={ref} className={`roll ${className}`.trim()} aria-label={text}>
      {chars.map((c, i) =>
        c === ' '
          ? <span key={i} className="roll--space" aria-hidden />
          : <span key={i} className="roll__c" style={{ ['--i' as string]: i }} aria-hidden>{c}</span>
      )}
    </span>
  )
}
