'use client'
import { useEffect } from 'react'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'
import { Lines } from '@/components/ui/Type'

export default function Formula() {
  const { lang } = useLang()
  useEffect(() => { observeReveals() }, [lang])

  return (
    <section id="formula" className="relative py-24 md:py-36">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <p className="kicker" data-rv>{pick(COPY.formula.kicker, lang)}</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4.6vw,3.6rem)]">
            <Lines lines={[pick(COPY.formula.title, lang)]} start={80} />
          </h2>
          <p className="lede mt-5" data-rv style={{ ['--d' as string]: '170ms' }}>
            {pick(COPY.formula.lede, lang)}
          </p>
        </div>

        <div className="grid">
          {COPY.formula.pillars.map((pill, i) => (
            <div
              key={pill.n}
              data-rv
              style={{ ['--d' as string]: `${140 + i * 130}ms`, borderColor: 'color-mix(in srgb, var(--fg) 14%, transparent)' }}
              className="flex gap-6 border-t py-7"
            >
              <span className="font-display text-[1.6rem] font-light" style={{ color: 'var(--accent)' }}>{pill.n}</span>
              <div>
                <h3 className="text-[1.08rem] font-semibold">{pick(pill.h, lang)}</h3>
                <p className="mt-1.5 text-[0.93rem] leading-relaxed" style={{ color: 'var(--fg-mute)' }}>
                  {pick(pill.p, lang)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
