let io: IntersectionObserver | null = null

/**
 * Anything already inside the first screen is revealed immediately — an observer
 * with a bottom margin would otherwise leave footer-level hero content invisible.
 */
export function observeReveals(root: ParentNode = document) {
  const targets = root.querySelectorAll<HTMLElement>('[data-rv]:not(.is-in)')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-in'))
    return
  }
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          io!.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.01 }
    )
  }
  const vh = window.innerHeight
  targets.forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.top < vh && r.bottom > 0) el.classList.add('is-in')
    else io!.observe(el)
  })
}

/** Reveal everything inside a container now (used inside pinned sections). */
export function revealIn(root: HTMLElement | null) {
  if (!root) return
  requestAnimationFrame(() => {
    root.querySelectorAll<HTMLElement>('[data-rv]:not(.is-in)').forEach((el) => el.classList.add('is-in'))
  })
}
