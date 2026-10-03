import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Shared, mutable state written by the master timeline and read every frame by
 * the particle bridge and the background layer. Keeping it outside React means
 * the scroll animation never triggers a re-render.
 */
export type ChainState = {
  /** 0..1 across the whole pinned chain. */
  progress: number
  /** Index of the product currently leading. */
  step: number
  /** 0..1 while one product dissolves into the next. */
  morph: number
  /** Which two products the current morph is bridging. */
  from: number
  to: number
}

export const createChainState = (): ChainState => ({
  progress: 0, step: 0, morph: 0, from: 0, to: 1
})

type Args = {
  section: HTMLElement
  stage: HTMLElement
  items: HTMLElement[]
  state: ChainState
  onStep: (i: number) => void
}

/**
 * ONE timeline drives every product. A product's exit and its successor's
 * entrance overlap on purpose — that overlap is the morph window, so the
 * sequence reads as a single continuous motion rather than six separate ones.
 */
export function buildChain({ section, stage, items, state, onStep }: Args) {
  const steps = items.length
  if (!steps) return () => {}

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // blurring six full-bleed product images every scrub frame is the single
  // heaviest thing on a phone GPU — on small screens fade and scale instead
  const light = window.innerWidth < 860
  const blurIn = light ? 'blur(0px)' : 'blur(14px)'
  const blurOut = light ? 'blur(0px)' : 'blur(16px)'
  const EXIT = 0.56       // when a product starts leaving, within its own unit
  const ENTER = 0.78      // when its successor starts arriving
  const SPAN = 0.26       // length of each entrance / exit

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        // a shorter run per product on phones so the pinned chapter is not a marathon
        end: () => `+=${window.innerHeight * steps * (light ? 0.62 : 0.92)}`,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: reduced ? true : 0.55,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          state.progress = self.progress
          // the morph peaks ~0.8 into each unit — swap the copy there, not at the boundary
          const i = Math.min(steps - 1, Math.floor(self.progress * steps + 0.22))
          if (i !== state.step) { state.step = i; onStep(i) }
        }
      }
    })

    items.forEach((el, i) => {
      const unit = i

      if (i === 0) {
        tl.set(el, { opacity: 1, yPercent: 0, scale: 1, filter: 'blur(0px)' }, 0)
      } else {
        tl.fromTo(
          el,
          { opacity: 0, yPercent: 16, scale: 0.84, filter: blurIn },
          { opacity: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: SPAN },
          unit - 1 + ENTER
        )
      }

      if (i < steps - 1) {
        tl.to(
          el,
          { opacity: 0, yPercent: -14, scale: 0.78, filter: blurOut, duration: SPAN, ease: 'power2.in' },
          unit + EXIT
        )
      }
    })

    // the morph window: ramps up as one product dissolves, down as the next lands
    for (let i = 0; i < steps - 1; i++) {
      const o = { v: 0 }
      const write = () => { state.morph = o.v; state.from = i; state.to = i + 1 }
      tl.to(o, { v: 1, duration: (ENTER - EXIT), ease: 'none', onUpdate: write }, i + EXIT)
      tl.to(o, { v: 0, duration: SPAN, ease: 'none', onUpdate: write }, i + ENTER)
    }

    // keep the timeline exactly `steps` long so progress maps cleanly to index
    tl.to({}, { duration: 0.01 }, steps - 0.01)
  }, stage)

  return () => ctx.revert()
}

let registered = false
export function registerGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export { gsap, ScrollTrigger }
