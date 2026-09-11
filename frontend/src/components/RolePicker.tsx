import { BriefcaseBusiness, ChevronDown, Search } from 'lucide-react'
import type { JobTitle } from '../api'
import type { ApiMode } from '../hooks/useSkillGap'
import { useLang } from '../LangContext'

/** ช่องเลือกตำแหน่งงานเป้าหมาย + ตัวกรองอุตสาหกรรม (อยู่ในแถบซ้าย) */
export default function RolePicker({
  apiMode,
  industries,
  selectedIndustry,
  onSelectIndustry,
  query,
  onQueryChange,
  isMenuOpen,
  onMenuOpenChange,
  filteredTitles,
  onChooseRole,
}: {
  apiMode: ApiMode
  industries: string[]
  selectedIndustry: string
  onSelectIndustry: (industry: string) => void
  query: string
  onQueryChange: (query: string) => void
  isMenuOpen: boolean
  onMenuOpenChange: (open: boolean | ((prev: boolean) => boolean)) => void
  filteredTitles: JobTitle[]
  onChooseRole: (title: string) => void
}) {
  const { T } = useLang()

  if (apiMode === 'checking') {
    return (
      <section className="control-section">
        <div className="skeleton-block" aria-label="Loading role controls">
          <span className="skeleton-line short" />
          <span className="skeleton-line input" />
          <div className="skeleton-chip-row">
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} className="skeleton-chip" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="control-section">
      <div className="industry-filter" aria-label="Industry filter">
        <button
          type="button"
          className={selectedIndustry === 'all' ? 'active' : ''}
          onClick={() => onSelectIndustry('all')}
        >
          {T.allIndustries}
        </button>
        {industries.map((industry) => (
          <button
            key={industry}
            type="button"
            className={selectedIndustry === industry ? 'active' : ''}
            onClick={() => onSelectIndustry(industry)}
          >
            {industry}
          </button>
        ))}
      </div>
      <label htmlFor="role-search">{T.targetRole}</label>
      <div className="autocomplete">
        <Search size={18} aria-hidden="true" />
        <input
          id="role-search"
          value={query}
          onChange={(e) => { onQueryChange(e.target.value); onMenuOpenChange(true) }}
          onFocus={() => onMenuOpenChange(true)}
          placeholder={apiMode === 'connected' ? T.searchPlaceholder : T.loadingRoles}
        />
        <button
          type="button"
          className="icon-button"
          aria-label="Show roles"
          onClick={() => onMenuOpenChange((o) => !o)}
        >
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </div>
      {isMenuOpen && filteredTitles.length > 0 && (
        <div className="role-menu">
          {filteredTitles.map((j) => (
            <button key={j.title} type="button" onClick={() => onChooseRole(j.title)}>
              <BriefcaseBusiness size={16} aria-hidden="true" />
              <span>{j.title}</span>
              <small style={{ marginLeft: 'auto', opacity: 0.5 }}>{j.industry}</small>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
