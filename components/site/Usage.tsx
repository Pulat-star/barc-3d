'use client'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'

/** The heading holds the left column, the three steps the right. */
export default function Usage({ id }: { id?: string }) {
  const { lang } = useLang()
  const u = COPY.site.usage

  return (
    <section id={id} style={{ background: 'var(--paper-2)' }}>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-2 md:gap-20 md:px-12 md:py-24">
        <div>
          <p className="eyebrow" data-rv>{pick(u.eyebrow, lang)}</p>
          <h2 className="display mt-6 text-[clamp(2rem,4.6vw,3.2rem)]">
            <span className="line"><span className="line__i">{pick(u.t1, lang)}</span></span>
            <span className="line"><span className="line__i" style={{ ['--d' as string]: '80ms' }}>{pick(u.t2, lang)}</span></span>
          </h2>
          <p className="lede mt-7 max-w-[42ch]" data-rv>{pick(u.note, lang)}</p>
        </div>

        <ol className="flex flex-col">
          {u.steps.map((s, i) => (
            <li
              key={i}
              className="flex gap-6 border-t py-6 first:border-t-0 first:pt-0 md:gap-8 md:py-7"
              style={{ borderColor: 'color-mix(in srgb, var(--lav) 22%, transparent)', ['--d' as string]: `${i * 110}ms` }}
              data-rv
            >
              <span className="display shrink-0 text-[2rem] leading-none" style={{ color: 'var(--accent)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold">{pick(s.title, lang)}</h3>
                <p className="meta mt-2 max-w-[44ch]">{pick(s.body, lang)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
