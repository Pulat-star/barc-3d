'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import type { Lang } from '@/lib/copy'

const Ctx = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'en', toggle: () => {} })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'uz' : 'en')), [])
  return <Ctx.Provider value={{ lang, toggle }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
