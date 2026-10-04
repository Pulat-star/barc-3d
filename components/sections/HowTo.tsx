'use client'
import { useEffect } from 'react'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'

/** For the shopper: the three steps printed on the back of the pack. */
export default function HowTo() {
  const { lang } = useLang()
  useEffect(() => { observeReveals() }, [lang])

  return (
    <section id="howto" className="relative py-20 md:py-28">
      <div className="wrap">
        <p className="kicker" data-rv>{pick(COPY.howto.kicker, lang)}</p>
        <h2 className="display mt-3 text-[clamp(1.9rem,4.6vw,3.4rem)]">
          <Lines lines={[pick(COPY.howto.title, lang)]} start={60} />
        </h2>
        <p className="lede mt-5" data-rv style={{ ['--d' as string]: '180ms' }}>{pick(COPY.howto.lede, lang)}</p>

        <ol className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          {COPY.howto.steps.map((s, i) => (
            <li
              key={s.n}
              data-rv
              style={{ ['--d' as string]: `${140 + i * 120}ms`, borderColor: 'color-mix(in srgb, var(--fg) 16%, transparent)' }}
              className="relative rounded-3xl border p-6 md:p-7"
            >
              <span
                className="font-brand grid h-10 w-10 place-items-center rounded-full text-[0.95rem] font-black"
                style={{ background: 'var(--accent)', color: '#2A0846' }}
              >
                {s.n}
              </span>
              <h3 className="mt-5 text-[1.08rem] font-semibold">{pick(s.h, lang)}</h3>
              <p className="mt-2 text-[0.93rem] leading-relaxed" style={{ color: 'var(--fg-mute)' }}>{pick(s.p, lang)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
