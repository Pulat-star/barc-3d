'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/masterTimeline'

/**
 * Lenis drives scrolling; ScrollTrigger is told about every frame so the pinned
 * sections stay locked to the smoothed position instead of the native one.
 *
 * The numbers are the reference's, not defaults. `syncTouch` is the one that
 * matters most: without it a phone falls back to native momentum and the heavy,
 * silky feel that the whole design rests on only exists on desktop.
 */
export default function SmoothScroll() {
  useEffect(() => {
    registerGsap()
    // reduced motion turns smooth scrolling off outright rather than damping it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.085,
      autoRaf: false
    })
    lenis.on('scroll', ScrollTrigger.update)
    // the pinned gallery's arrows scroll to a position; they need the same
    // instance, or a native scrollTo fights Lenis for the scroll offset
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      lenis.destroy()
    }
  }, [])

  return null
}
