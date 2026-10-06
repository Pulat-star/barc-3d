'use client'
import { useEffect } from 'react'
import Header from '@/components/site/Header'
import Gallery from '@/components/site/Gallery'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'

/**
 * 01 Desktop · Home — the slogan, then the gallery on its dome. The frame in
 * the design is exactly one screen tall, so the page ends at the strip under
 * the controls; everything else is reached from the menu or "all products".
 */
export default function Home() {
  const { lang } = useLang()
  const home = COPY.site.home

  useEffect(() => { observeReveals() }, [lang])

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'calc(88px + var(--sa-top))' }}>
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-[18px] px-6 pb-8 pt-8 text-center md:px-12 md:pb-12 md:pt-9">
          <p className="eyebrow" data-rv>{pick(home.eyebrow, lang)}</p>

          <h1 className="display mx-auto max-w-[1100px] text-[clamp(2.5rem,6.4vw,5.75rem)]">
            <span className="line"><span className="line__i">{pick(home.s1, lang)}</span></span>
            <span className="line">
              <span className="line__i" style={{ ['--d' as string]: '80ms' }}>
                <span className="italic" style={{ color: 'var(--grape)' }}>{pick(home.s2, lang)}</span>
                {pick(home.s3, lang)}
              </span>
            </span>
          </h1>

          <p className="lede max-w-[800px]" data-rv style={{ ['--d' as string]: '160ms' }}>
            {pick(home.promise, lang)}
          </p>
        </div>

        <Gallery />
      </main>
    </>
  )
}
