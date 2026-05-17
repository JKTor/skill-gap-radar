import { createContext, useContext, useState, type ReactNode } from 'react'
import { t, type Lang } from './i18n'

type LangCtx = {
  lang: Lang
  T: (typeof t)[Lang]
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

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext)
