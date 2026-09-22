// Scroll reveal: one observer for the whole page. Elements opt in with data-rv
// and stagger with --d. Reduced-motion users get everything revealed at once.
let io = null
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function observeReveals(root = document) {
  const targets = root.querySelectorAll('[data-rv]:not(.is-in)')
  if (reduced()) { targets.forEach((el) => el.classList.add('is-in')); return }
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.01 })
  }
  targets.forEach((el) => io.observe(el))
}
