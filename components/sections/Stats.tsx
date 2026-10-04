'use client'
import { useEffect } from 'react'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'

/** The numbers a buyer or a buyer's buying team asks for first. */
export default function Stats() {
  const { lang } = useLang()
  useEffect(() => { observeReveals() }, [lang])

  return (
    <section className="relative py-12 md:py-16">
      <div className="wrap">
        <p className="kicker" data-rv>{pick(COPY.stats.kicker, lang)}</p>
        <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 md:gap-8">
          {COPY.stats.items.map((s, i) => (
            <div key={s.v} data-rv style={{ ['--d' as string]: `${100 + i * 110}ms` }}>
              <dt className="font-brand text-[clamp(2.2rem,5.6vw,3.8rem)] font-black leading-none" dir="ltr">
                {s.v}
              </dt>
              <dd className="mt-2.5 text-[0.84rem] leading-snug" style={{ color: 'var(--fg-mute)' }}>
                {pick(s.l, lang)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
