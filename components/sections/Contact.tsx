'use client'
import { useEffect, useState } from 'react'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'
import { observeReveals } from '@/lib/reveal'

export default function Contact() {
  const { lang } = useLang()
  const [sent, setSent] = useState(false)
  useEffect(() => { observeReveals() }, [lang, sent])

  const field = 'w-full rounded-2xl px-4 py-3.5 text-[0.98rem] outline-none transition-shadow'
  const fieldStyle = {
    background: 'color-mix(in srgb, var(--fg) 5%, transparent)',
    border: '1px solid color-mix(in srgb, var(--fg) 16%, transparent)',
    color: 'var(--fg)'
  }

  return (
    <section id="contact" className="relative py-24 md:py-36">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-20">
        <div>
          <p className="kicker" data-rv>{pick(COPY.contact.kicker, lang)}</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4.6vw,3.6rem)]" data-rv style={{ ['--d' as string]: '80ms' }}>
            {pick(COPY.contact.title, lang)}
          </h2>
          <p className="lede mt-5" data-rv style={{ ['--d' as string]: '170ms' }}>
            {pick(COPY.contact.lede, lang)}
          </p>
        </div>

        {sent ? (
          <div
            className="flex flex-col items-start justify-center gap-4 rounded-3xl p-8"
            role="status"
            data-rv
            style={{ border: '1px solid color-mix(in srgb, var(--fg) 14%, transparent)' }}
          >
            <span className="grid h-11 w-11 place-items-center rounded-full text-lg" style={{ background: 'var(--accent)', color: '#fff' }}>✓</span>
            <p className="display text-[1.6rem]">{pick(COPY.contact.done, lang)}</p>
            <button className="btn btn-line" onClick={() => setSent(false)}>{pick(COPY.contact.again, lang)}</button>
          </div>
        ) : (
          <form
            className="grid gap-4 rounded-3xl p-6 md:p-8"
            data-rv
            style={{ ['--d' as string]: '140ms', border: '1px solid color-mix(in srgb, var(--fg) 14%, transparent)' }}
            onSubmit={(e) => { e.preventDefault(); setSent(true) }}
          >
            <label className="grid gap-2">
              <span className="text-[0.78rem] font-semibold" style={{ color: 'var(--fg-mute)' }}>{pick(COPY.contact.name, lang)}</span>
              <input required minLength={2} name="name" className={field} style={fieldStyle} placeholder={pick(COPY.contact.namePh, lang)} />
            </label>
            <label className="grid gap-2">
              <span className="text-[0.78rem] font-semibold" style={{ color: 'var(--fg-mute)' }}>{pick(COPY.contact.company, lang)}</span>
              <input required name="company" className={field} style={fieldStyle} placeholder={pick(COPY.contact.companyPh, lang)} />
            </label>
            <label className="grid gap-2">
              <span className="text-[0.78rem] font-semibold" style={{ color: 'var(--fg-mute)' }}>{pick(COPY.contact.email, lang)}</span>
              <input required name="contact" className={field} style={fieldStyle} placeholder={pick(COPY.contact.emailPh, lang)} />
            </label>
            <button type="submit" className="btn btn-pink mt-1 w-full">{pick(COPY.contact.send, lang)}</button>
            <p className="text-center text-[0.76rem]" style={{ color: 'var(--fg-mute)' }}>{pick(COPY.contact.note, lang)}</p>
          </form>
        )}
      </div>
    </section>
  )
}
