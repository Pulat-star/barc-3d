// Single source of truth for scroll-driven animation.
// Deliberately avoids dvh and re-measures on every viewport change —
// iOS Safari changes innerHeight when the toolbar collapses, and skipping
// that recompute is what desyncs scroll-linked scenes.

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)

export const journey = {
  scrollY: 0,
  vw: 0,
  vh: 0,
  isMobile: false,
  reduced: false,
  heroP: 0,   // 0..1 through the hero
  chapP: 0,   // 0..PRODUCT_COUNT through the chapter stack
  mode: 0,    // 0 = hero layout, 1 = chapter layout
  exit: 0,    // 1 once the chapter stack is behind us
  docP: 0,    // whole-page progress, for the top bar
  active: 0,
  pointer: { x: 0, y: 0 }
}

if (typeof window !== 'undefined') window.__journey = journey

let els = { hero: null, chapters: null }
let panels = []
let box = { heroTop: 0, heroH: 0, chapTop: 0, chapH: 0 }
let listeners = new Set()
let raf = 0
let started = false
let chapterCount = 3

export function registerSections(hero, chapters) {
  els.hero = hero
  els.chapters = chapters
  measure()
}

export function registerPanels(list) {
  panels = list.filter(Boolean)
}

export function onActiveChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function measure() {
  journey.vw = window.innerWidth
  journey.vh = window.innerHeight
  journey.isMobile = window.innerWidth < 860
  const y = window.scrollY || document.documentElement.scrollTop || 0
  if (els.hero) {
    const r = els.hero.getBoundingClientRect()
    box.heroTop = r.top + y
    box.heroH = r.height
  }
  if (els.chapters) {
    const r = els.chapters.getBoundingClientRect()
    box.chapTop = r.top + y
    box.chapH = r.height
  }
}

let lastActive = -1
let lastDocP = -1

function tick() {
  const y = window.scrollY || document.documentElement.scrollTop || 0
  journey.scrollY = y
  journey.docP = clamp(y / Math.max(document.documentElement.scrollHeight - journey.vh, 1))
  if (Math.abs(journey.docP - lastDocP) > 0.0015) {
    lastDocP = journey.docP
    document.documentElement.style.setProperty('--docp', journey.docP.toFixed(4))
  }

  const heroSpan = Math.max(box.heroH, 1)
  journey.heroP = clamp((y - box.heroTop) / heroSpan)

  // the chapter stack is [chapters.top, chapters.top + height - vh]
  const chapSpan = Math.max(box.chapH - journey.vh, 1)
  const raw = clamp((y - box.chapTop) / chapSpan)
  journey.chapP = raw * chapterCount

  // hand-off from the hero row to the single standing pack
  const handOff = Math.max(journey.vh * 0.55, 1)
  journey.mode = clamp((y - (box.chapTop - handOff)) / handOff)

  // once the pinned stack releases, retire the 3D pack instead of letting it
  // float over the sections below
  const chapEnd = box.chapTop + box.chapH - journey.vh
  journey.exit = clamp((y - chapEnd) / Math.max(journey.vh * 0.4, 1))

  // grail-style stacking: each sticky panel recedes as the next one covers it
  for (let i = 0; i < panels.length; i++) {
    const next = panels[i + 1]
    if (!next) { panels[i].style.setProperty('--recede', '0'); continue }
    const top = next.getBoundingClientRect().top
    panels[i].style.setProperty('--recede', clamp(1 - top / Math.max(journey.vh, 1)).toFixed(3))
  }

  const idx = Math.min(chapterCount - 1, Math.max(0, Math.floor(journey.chapP - 0.001 + 0.35)))
  journey.active = idx
  if (idx !== lastActive) {
    lastActive = idx
    listeners.forEach((fn) => fn(idx))
  }

  raf = requestAnimationFrame(tick)
}

export function startJourney(count = 3) {
  if (started) return () => {}
  started = true
  chapterCount = count
  journey.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const remeasure = () => measure()
  let t = 0
  const debounced = () => { clearTimeout(t); t = setTimeout(remeasure, 60) }

  const onPointer = (e) => {
    journey.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    journey.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }

  measure()
  window.addEventListener('resize', debounced)
  window.addEventListener('orientationchange', debounced)
  window.visualViewport?.addEventListener('resize', debounced)
  window.addEventListener('pointermove', onPointer, { passive: true })
  document.fonts?.ready.then(remeasure)
  window.addEventListener('load', remeasure)

  raf = requestAnimationFrame(tick)

  return () => {
    started = false
    cancelAnimationFrame(raf)
    clearTimeout(t)
    window.removeEventListener('resize', debounced)
    window.removeEventListener('orientationchange', debounced)
    window.visualViewport?.removeEventListener('resize', debounced)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('load', remeasure)
  }
}

export { clamp }
