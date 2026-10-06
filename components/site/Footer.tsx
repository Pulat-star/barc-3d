'use client'
import Link from 'next/link'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'

/** BÄRC/Footer — the brand line set large, the links as a quiet column beside it. */
export default function Footer() {
  const { lang } = useLang()
  const nav = COPY.site.nav

  const links = [
    { href: '/mahsulotlar/', label: pick(nav.products, lang) },
    { href: '/#afzalliklar', label: pick(nav.benefits, lang) },
    { href: '/#qanday-ishlatiladi', label: pick(nav.usage, lang) },
    { href: '/#barc-haqida', label: pick(nav.about, lang) }
  ]

  return (
    <footer style={{ background: 'var(--paper-deep)' }}>
      <div
        className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-14 md:px-12 md:py-20"
        style={{ paddingBottom: 'calc(3.5rem + var(--sa-bot))' }}
      >
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <p className="display text-[clamp(1.9rem,4.4vw,2.6rem)]" data-rv>
            {pick(COPY.footer.line1, lang)}
            <br />
            {pick(COPY.footer.line2, lang)}
          </p>
          <nav className="flex flex-wrap gap-6 text-[14px] md:gap-8" style={{ color: 'var(--ink)' }}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="group tap inline-flex items-center gap-2">
                <span className="marker" />
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col justify-between gap-2 text-[12px] md:flex-row" style={{ color: 'var(--muted)' }}>
          <p>© {new Date().getFullYear()} BÄRC</p>
          <p className="md:text-right">{pick(COPY.site.home.promise, lang)}</p>
        </div>
      </div>
    </footer>
  )
}
