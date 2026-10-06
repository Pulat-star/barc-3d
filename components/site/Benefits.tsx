'use client'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'

/** The three marks are drawn, not imported: they recolour with the tokens. */
const ICONS = [
  // powerful cleaning — a four-point sparkle
  'M12 2 13.9 8.1 20 10 13.9 11.9 12 18 10.1 11.9 4 10 10.1 8.1Z',
  // pleasant scent — a rising wisp
  'M12 21c3.3 0 6-2.5 6-5.6 0-3.6-3-5.3-3-8.4 0-1.6.8-3 2-4-4.6.5-8 3.6-8 7.4 0 2.6 2 3.8 2 5.8 0 1.2-.8 2.2-2 2.6A6 6 0 0 0 12 21Z',
  // fabric care — a folded garment
  'M9 3 4 6l1.6 4L8 9v12h8V9l2.4 1L20 6l-5-3-3 2Z'
]

/** BÄRC/Benefits — the one saturated band on an otherwise pale page. */
export default function Benefits() {
  const { lang } = useLang()
  const b = COPY.site.benefits

  return (
    <section style={{ background: 'var(--grape)', color: 'var(--white)' }}>
      <div className="mx-auto max-w-[1440px] px-6 py-16 text-center md:px-12 md:py-24">
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,.72)' }} data-rv>
          {pick(b.eyebrow, lang)}
        </p>

        <h2 className="display mx-auto mt-6 text-[clamp(2rem,5vw,3.4rem)]" style={{ color: 'var(--white)' }}>
          <span className="line"><span className="line__i">{pick(b.t1, lang)}</span></span>
          <span className="line"><span className="line__i" style={{ ['--d' as string]: '80ms' }}>{pick(b.t2, lang)}</span></span>
        </h2>

        <ul className="mx-auto mt-14 grid max-w-[1100px] gap-10 text-center md:grid-cols-3 md:gap-12">
          {b.items.map((item, i) => (
            <li key={i} data-rv style={{ ['--d' as string]: `${i * 110}ms` }}>
              <svg viewBox="0 0 24 24" aria-hidden className="mx-auto size-7" fill="currentColor" style={{ color: 'rgba(255,255,255,.9)' }}>
                <path d={ICONS[i]} />
              </svg>
              <h3 className="display mt-5 text-[1.5rem]" style={{ color: 'var(--white)' }}>
                {pick(item.title, lang)}
              </h3>
              <p className="mx-auto mt-3 max-w-[32ch] text-[14px] leading-[22px]" style={{ color: 'rgba(255,255,255,.78)' }}>
                {pick(item.body, lang)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
