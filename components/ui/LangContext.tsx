'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { LANGS, type Lang } from '@/lib/copy'

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; dir: 'ltr' | 'rtl' }>({
  lang: 'en',
  setLang: () => {},
  dir: 'ltr'
})

const dirOf = (l: Lang) => LANGS.find((x) => x.code === l)?.dir ?? 'ltr'

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const dir = dirOf(lang)

  // remember the choice, and mirror the document for Arabic
  useEffect(() => {
    const saved = window.localStorage.getItem('barc-lang') as Lang | null
    if (saved && LANGS.some((l) => l.code === saved)) setLangState(saved)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
    root.classList.toggle('is-rtl', dir === 'rtl')
    try { window.localStorage.setItem('barc-lang', lang) } catch {}
  }, [lang, dir])

  const setLang = useCallback((l: Lang) => setLangState(l), [])

  return <Ctx.Provider value={{ lang, setLang, dir }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
