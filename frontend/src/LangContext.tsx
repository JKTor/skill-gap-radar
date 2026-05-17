import { createContext, useContext, useState, type ReactNode } from 'react'
import { t, type Lang } from './i18n'

type LangCtx = {
  lang: Lang
  T: typeof t['th']
  toggle: () => void
}

const LangContext = createContext<LangCtx>({
  lang: 'th',
  T: t.th,
  toggle: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('th')
  const toggle = () => setLang((l) => (l === 'th' ? 'en' : 'th'))
  return (
    <LangContext.Provider value={{ lang, T: t[lang], toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
