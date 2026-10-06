'use client'
import { useEffect, useRef } from 'react'

/**
 * Label whose glyphs roll up out of a mask, 18 ms apart.
 *
 * `on` is for labels inside something that opens and closes — the overlay menu
 * — where the roll has to replay each time rather than once on mount.
 */
export default function Roll({
  text, className = '', delay = 0, on
}: { text: string; className?: string; delay?: number; on?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (on === false) { el.classList.remove('is-in'); return }
    const t = window.setTimeout(() => el.classList.add('is-in'), 40 + delay)
    return () => window.clearTimeout(t)
  }, [text, delay, on])

  // Arabic letters change shape depending on their neighbours, so splitting the
  // string into one span per character breaks the joins and the glyphs collide.
  // Those labels roll as a single block instead.
  const joined = /[؀-ۿݐ-ݿ]/.test(text)

  return (
    <span ref={ref} className={`roll ${className}`.trim()} aria-label={text}>
      {joined ? (
        <span className="roll__c" aria-hidden>{text}</span>
      ) : (
        Array.from(text).map((c, i) =>
          c === ' '
            ? <span key={i} className="roll--space" aria-hidden />
            : <span key={i} className="roll__c" style={{ ['--i' as string]: i }} aria-hidden>{c}</span>
        )
      )}
    </span>
  )
}
