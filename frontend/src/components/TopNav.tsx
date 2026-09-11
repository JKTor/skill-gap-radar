import { HelpCircle, Radar, Users } from 'lucide-react'
import { useLang } from '../LangContext'
import { useTheme } from '../ThemeContext'

export type Page = 'radar' | 'guide' | 'stats'

const tabIcon = { display: 'inline', verticalAlign: 'middle', marginRight: 5 } as const

export default function TopNav({
  page,
  onNavigate,
}: {
  page: Page
  onNavigate: (page: Page) => void
}) {
  const { lang, T, toggle } = useLang()
  const { theme, toggle: toggleTheme } = useTheme()

  return (
    <nav className="top-nav">
      <span className="brand-mark">
        <Radar size={16} aria-hidden="true" />
      </span>
      <span className="top-nav-title">Skill-Gap Radar</span>
      <button
        className={`nav-tab ${page === 'guide' ? 'active' : ''}`}
        onClick={() => onNavigate('guide')}
      >
        <HelpCircle size={14} style={tabIcon} />
        {T.navGuide}
      </button>
      <button
        className={`nav-tab ${page === 'radar' ? 'active' : ''}`}
        onClick={() => onNavigate('radar')}
      >
        <Radar size={14} style={tabIcon} />
        {T.navRadar}
      </button>
      <button
        className={`nav-tab ${page === 'stats' ? 'active' : ''}`}
        onClick={() => onNavigate('stats')}
      >
        <Users size={14} style={tabIcon} />
        {T.navStats}
      </button>
      <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
        {lang === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}
      </button>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  )
}
