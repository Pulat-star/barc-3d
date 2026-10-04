const GLYPHS = '▓▒░#$%&@*+=/\\<>ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

/**
 * Resolves text under a band of noise that sweeps left to right: characters
 * behind the band are already final, the band itself is garbage, ahead of it is
 * blank. Cheap, and it reads as far more deliberate than a plain fade.
 */
export function scramble(el: HTMLElement, text: string, duration = 760) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = text
    return () => {}
  }

  const chars = [...text]
  const band = Math.max(3, Math.round(chars.length * 0.34))
  const start = performance.now()
  let raf = 0

  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const head = t * (chars.length + band)
    let out = ''
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === ' ') { out += ' '; continue }
      if (i < head - band) out += chars[i]
      else if (i < head) out += pick()
      else out += ' '
    }
    el.textContent = out
    if (t < 1) raf = requestAnimationFrame(frame)
    else el.textContent = text
  }
  raf = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(raf)
}
