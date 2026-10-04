'use client'
import { useEffect, useRef } from 'react'
import { SCENES } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/masterTimeline'

/** Scroll scrubs a soft wipe: the stained shirt becomes the clean one. */
export default function Lifestyle() {
  const { lang } = useLang()
  const section = useRef<HTMLElement>(null)
  const shirt = useRef<HTMLDivElement>(null)

  useEffect(() => { observeReveals() }, [lang])

  useEffect(() => {
    registerGsap()
    const s = section.current, el = shirt.current
    if (!s || !el) return
    const o = { v: 0 }
    const ctx = gsap.context(() => {
      gsap.to(o, {
        v: 1,
        ease: 'none',
        scrollTrigger: { trigger: s, start: 'top 72%', end: 'bottom 62%', scrub: 0.5 },
        onUpdate: () => el.style.setProperty('--wash', o.v.toFixed(4))
      })
    }, s)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} className="relative py-24 md:py-36">
      <div className="wrap grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="kicker" data-rv>{pick(COPY.lifestyle.kicker, lang)}</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4.6vw,3.6rem)]">
            <Lines lines={[pick(COPY.lifestyle.title, lang)]} start={80} />
          </h2>
          <p className="lede mt-5" data-rv style={{ ['--d' as string]: '170ms' }}>
            {pick(COPY.lifestyle.lede, lang)}
          </p>
        </div>

        <div ref={shirt} className="shirt relative mx-auto w-full max-w-[380px]" data-rv style={{ ['--d' as string]: '160ms' }}>
          <div className="shirt__stage relative aspect-[3/4] w-full overflow-hidden">
            <img src={SCENES.shirtDirty} alt="" className="shirt__img shirt__img--dirty" />
            <img src={SCENES.shirtClean} alt="" className="shirt__img shirt__img--clean" />
            <span aria-hidden className="shirt__sweep" />
          </div>
          <p className="relative mt-4 h-5 text-center font-mono text-[0.75rem] tracking-[0.2em] uppercase">
            <span className="shirt__tag shirt__tag--a">{pick(COPY.lifestyle.before, lang)}</span>
            <span className="shirt__tag shirt__tag--b">{pick(COPY.lifestyle.after, lang)}</span>
          </p>
        </div>
      </div>

      <style>{`
        .shirt__stage{ filter: drop-shadow(0 26px 44px rgba(20,19,23,.22)); }
        .shirt__img{ position:absolute; inset:0; width:100%; height:100%; object-fit:contain; }
        .shirt__img--dirty{
          -webkit-mask-image:linear-gradient(to bottom,transparent calc(var(--wash,0)*142% - 22%),#000 calc(var(--wash,0)*142%));
          mask-image:linear-gradient(to bottom,transparent calc(var(--wash,0)*142% - 22%),#000 calc(var(--wash,0)*142%));
        }
        .shirt__img--clean{
          -webkit-mask-image:linear-gradient(to bottom,#000 calc(var(--wash,0)*142% - 22%),transparent calc(var(--wash,0)*142%));
          mask-image:linear-gradient(to bottom,#000 calc(var(--wash,0)*142% - 22%),transparent calc(var(--wash,0)*142%));
        }
        .shirt__sweep{
          position:absolute; left:-6%; right:-6%; height:15%; pointer-events:none;
          top:calc(var(--wash,0)*130% - 15%);
          background:linear-gradient(to bottom,transparent,rgba(232,53,138,.5) 46%,rgba(255,255,255,.85) 62%,transparent);
          filter:blur(5px);
          opacity:clamp(0,calc(min(var(--wash,0)*8,(1 - var(--wash,0))*9)),1);
        }
        .shirt__tag{ position:absolute; left:50%; transform:translateX(-50%); white-space:nowrap; }
        .shirt__tag--a{ color:var(--fg-mute); opacity:clamp(0,calc((.58 - var(--wash,0))*5),1); }
        .shirt__tag--b{ color:var(--accent); opacity:clamp(0,calc((var(--wash,0) - .52)*5),1); }
      `}</style>
    </section>
  )
}
