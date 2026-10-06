'use client'
import { useEffect } from 'react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import Usage from '@/components/site/Usage'
import Benefits from '@/components/site/Benefits'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'

/** 08 Desktop · Usage — the steps, then the benefits band. */
export default function UsagePage() {
  const { lang } = useLang()
  const u = COPY.site.usage
  useEffect(() => { observeReveals() }, [lang])

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'calc(88px + var(--sa-top))' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-10 text-center md:px-12 md:pb-16 md:pt-14">
          <p className="eyebrow" data-rv>{pick(u.eyebrow, lang)}</p>
          <h1 className="display mx-auto mt-6 max-w-[1280px] text-[clamp(2.2rem,5.6vw,4.4rem)]">
            <span className="line"><span className="line__i">{pick(u.t1, lang)} {pick(u.t2, lang)}</span></span>
          </h1>
        </div>
        <Usage />
        <Benefits />
      </main>
      <Footer />
    </>
  )
}
