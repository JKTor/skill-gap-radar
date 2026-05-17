import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  HelpCircle,
  Radar,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  getHealth,
  getJobTitles,
  getSkills,
  quickAnalysis,
  recordVisit,
  type ApiHealth,
  type JobTitle,
  type SkillGapAnalysis,
  type SkillRead,
} from './api'
import { useLang } from './LangContext'
import { useTheme } from './ThemeContext'
import HowToUse from './pages/HowToUse'
import Stats from './pages/Stats'
import './App.css'

type Page = 'radar' | 'guide' | 'stats'

function App() {
  const { lang, T, toggle } = useLang()
  const { theme, toggle: toggleTheme } = useTheme()
  const [page, setPage] = useState<Page>('guide')

  // ─── Backend state ────────────────────────────────────────────────────────
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null)
  const [apiMode, setApiMode] = useState<'checking' | 'connected' | 'mock'>('checking')
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([])
  const [allSkills, setAllSkills] = useState<SkillRead[]>([])
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  // ─── UI state ─────────────────────────────────────────────────────────────
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [query, setQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [skillQuery, setSkillQuery] = useState('')

  // ─── Bootstrap ────────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true
    Promise.all([getHealth(), getJobTitles(), getSkills()])
      .then(([health, titles, skills]) => {
        if (!alive) return
        setApiHealth(health)
        setApiMode('connected')
        setJobTitles(titles)
        setAllSkills(skills)
        if (titles.length) {
          setSelectedRole(titles[0].title)
          setQuery(titles[0].title)
        }
        recordVisit('home').catch(() => {})
      })
      .catch(() => { if (alive) setApiMode('mock') })
    return () => { alive = false }
  }, [])

  // ─── Auto-analyse ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (apiMode !== 'connected' || !selectedRole) return
    const timer = setTimeout(() => {
      setAnalyzing(true)
      quickAnalysis(selectedRole, selectedSkills.map((name) => ({ name, level: 0.7 })))
        .then(setAnalysis)
        .catch(console.error)
        .finally(() => setAnalyzing(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [apiMode, selectedRole, selectedSkills])

  // ─── Derived ──────────────────────────────────────────────────────────────
  const filteredTitles = useMemo(
    () =>
      jobTitles.filter((j) => {
        const matchesIndustry = selectedIndustry === 'all' || j.industry === selectedIndustry
        const matchesQuery = j.title.toLowerCase().includes(query.toLowerCase())
        return matchesIndustry && matchesQuery
      }),
    [jobTitles, query, selectedIndustry],
  )

  const industries = useMemo(
    () => Array.from(new Set(jobTitles.map((j) => j.industry))).filter(Boolean),
    [jobTitles],
  )

  const filteredSkills = useMemo(
    () => allSkills.filter((skill) => skill.name.toLowerCase().includes(skillQuery.toLowerCase())),
    [allSkills, skillQuery],
  )

  const gaps = useMemo(() => analysis?.gaps ?? [], [analysis])
  const courses = useMemo(() => analysis?.recommended_courses ?? [], [analysis])

  // เปลี่ยน key ทุกครั้งที่ role หรือ skills เปลี่ยน → radar animation restart
  const radarKey = `${selectedRole}::${selectedSkills.join(',')}`

  const readiness = useMemo(() => {
    if (!gaps.length) return null
    const score = gaps.reduce((acc, g) => acc + Math.min(g.current_level / g.required_level, 1), 0)
    return Math.round((score / gaps.length) * 100)
  }, [gaps])

  const topGap = gaps[0] ?? null

  const chooseRole = useCallback((title: string) => {
    setSelectedRole(title)
    setQuery(title)
    setIsRoleMenuOpen(false)
  }, [])

  function toggleSkill(name: string) {
    setSelectedSkills((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper">
      {/* ── Top nav ───────────────────────────────────────────────────── */}
      <nav className="top-nav">
        <span className="brand-mark">
          <Radar size={16} aria-hidden="true" />
        </span>
        <span className="top-nav-title">Skill-Gap Radar</span>
        <button
          className={`nav-tab ${page === 'guide' ? 'active' : ''}`}
          onClick={() => setPage('guide')}
        >
          <HelpCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
          {T.navGuide}
        </button>
        <button
          className={`nav-tab ${page === 'radar' ? 'active' : ''}`}
          onClick={() => setPage('radar')}
        >
          <Radar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
          {T.navRadar}
        </button>
        <button
          className={`nav-tab ${page === 'stats' ? 'active' : ''}`}
          onClick={() => setPage('stats')}
        >
          <Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
          {T.navStats}
        </button>
        <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
          {lang === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}
        </button>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>

      {/* ── Pages ─────────────────────────────────────────────────────── */}
      {page === 'guide' && <HowToUse onStart={() => setPage('radar')} />}
      {page === 'stats' && <Stats />}
      {page === 'radar' && (
        <main className="app-shell">
          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="sidebar" aria-label="Skill-Gap Radar controls">
            <div className="brand">
              <span className="brand-mark">
                <Radar size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="eyebrow">Skill-Gap Radar</p>
                <h1>{T.navRadar}</h1>
              </div>
            </div>

            {/* Role picker */}
            <section className="control-section">
              {apiMode === 'checking' ? (
                <div className="skeleton-block" aria-label="Loading role controls">
                  <span className="skeleton-line short" />
                  <span className="skeleton-line input" />
                  <div className="skeleton-chip-row">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <span key={index} className="skeleton-chip" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
              <div className="industry-filter" aria-label="Industry filter">
                <button
                  type="button"
                  className={selectedIndustry === 'all' ? 'active' : ''}
                  onClick={() => setSelectedIndustry('all')}
                >
                  {T.allIndustries}
                </button>
                {industries.map((industry) => (
                  <button
                    key={industry}
                    type="button"
                    className={selectedIndustry === industry ? 'active' : ''}
                    onClick={() => setSelectedIndustry(industry)}
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
                  onChange={(e) => { setQuery(e.target.value); setIsRoleMenuOpen(true) }}
                  onFocus={() => setIsRoleMenuOpen(true)}
                  placeholder={apiMode === 'connected' ? T.searchPlaceholder : T.loadingRoles}
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Show roles"
                  onClick={() => setIsRoleMenuOpen((o) => !o)}
                >
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
              </div>
              {isRoleMenuOpen && filteredTitles.length > 0 && (
                <div className="role-menu">
                  {filteredTitles.map((j) => (
                    <button key={j.title} type="button" onClick={() => chooseRole(j.title)}>
                      <BriefcaseBusiness size={16} aria-hidden="true" />
                      <span>{j.title}</span>
                      <small style={{ marginLeft: 'auto', opacity: 0.5 }}>{j.industry}</small>
                    </button>
                  ))}
                </div>
              )}
                </>
              )}
            </section>

            {/* Skill picker */}
            <section className="control-section">
              <div className="section-title">
                <label>{T.yourSkills}</label>
                <span>{T.selectedCount(selectedSkills.length)}</span>
              </div>
              {apiMode === 'checking' ? (
                <div className="skeleton-block" aria-label="Loading skills">
                  <span className="skeleton-line input" />
                  <div className="skeleton-chip-row">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <span key={index} className="skeleton-chip" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
              <div className="skill-filter">
                <Search size={15} aria-hidden="true" />
                <input
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  placeholder={T.filterSkills}
                  aria-label={T.filterSkills}
                />
              </div>
              <div className="skill-picker">
                {filteredSkills.map((skill) => {
                  const selected = selectedSkills.includes(skill.name)
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      className={selected ? 'selected' : ''}
                      onClick={() => toggleSkill(skill.name)}
                    >
                      {selected ? <Check size={14} aria-hidden="true" /> : <span />}
                      {skill.name}
                    </button>
                  )
                })}
              </div>
              {filteredSkills.length === 0 && (
                <p className="empty-skills">{T.noSkillsFound}</p>
              )}
                </>
              )}
            </section>
          </aside>

          {/* ── Workspace ─────────────────────────────────────────────── */}
          <section className="workspace">
            {apiMode === 'checking' ? (
              <header className="workspace-header skeleton-workspace" aria-label="Loading analysis">
                <div>
                  <span className="skeleton-line short" />
                  <span className="skeleton-line title" />
                  <span className="skeleton-line wide" />
                </div>
              </header>
            ) : (
            <header className="workspace-header">
              <div>
                <p className="eyebrow">{T.targetScan}</p>
                <h2>{selectedRole || '—'}</h2>
                <p>
                  {analysis
                    ? T.matchingJobs(analysis.matched_jobs)
                    : apiMode === 'mock' ? T.backendOffline : T.selectRole}
                </p>
              </div>
              <div className="header-actions" aria-label="Role metrics">
                <div className={`api-status ${apiMode}`}>
                  <span>{T.backendLabel}</span>
                  <strong>
                    {apiMode === 'connected' ? apiHealth?.status : T.mockMode}
                  </strong>
                </div>
                {readiness !== null && (
                  <div>
                    <span>{T.readinessLabel}</span>
                    <strong>{analyzing ? '…' : `${readiness}%`}</strong>
                  </div>
                )}
                {analysis && (
                  <div>
                    <span>{T.gapScoreLabel}</span>
                    <strong>{analyzing ? '…' : `${Math.round(analysis.gap_score * 100)}%`}</strong>
                  </div>
                )}
              </div>
            </header>
            )}

            {/* Radar + insight */}
            {gaps.length > 0 && (
              <div className="dashboard-grid">
                <section className="radar-panel" aria-label="Skill demand radar">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">{T.demandVsProfile}</p>
                      <h3>{T.skillRadar}</h3>
                    </div>
                    <Sparkles size={20} aria-hidden="true" />
                  </div>
                  <div className="radar-visual" key={radarKey}>
                    {gaps.slice(0, 5).map((gap, i) => (
                      <div
                        key={gap.skill_id}
                        className={`radar-node node-${i + 1}`}
                        style={{
                          ['--score' as string]: `${Math.round(gap.current_level * 100)}%`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      >
                        <span>{gap.skill_name}</span>
                        <strong>{Math.round(gap.current_level * 100)}</strong>
                      </div>
                    ))}
                    <div className="radar-ring ring-large" />
                    <div className="radar-ring ring-mid" />
                    <div className="radar-ring ring-small" />
                    <div className="radar-sweep" />
                  </div>
                </section>

                <section className="insight-panel">
                  {topGap && (
                    <div className="metric-row">
                      <Target size={20} aria-hidden="true" />
                      <div>
                        <span>{T.largestGap}</span>
                        <strong>{topGap.skill_name}</strong>
                      </div>
                      <b>{Math.round(topGap.gap * 100)}%</b>
                    </div>
                  )}
                  {readiness !== null && (
                    <div className="metric-row">
                      <TrendingUp size={20} aria-hidden="true" />
                      <div>
                        <span>{T.marketFit}</span>
                        <strong>{readiness >= 75 ? T.readyToApply : T.needsPrep}</strong>
                      </div>
                      <b>{readiness}%</b>
                    </div>
                  )}
                  <div className="metric-row">
                    <Clock3 size={20} aria-hidden="true" />
                    <div>
                      <span>{T.suggestedSprint}</span>
                      <strong>{T.weeks}</strong>
                    </div>
                    <b>{T.focusSkills(Math.min(gaps.length, 3))}</b>
                  </div>
                </section>
              </div>
            )}

            {/* Gap table */}
            {gaps.length > 0 && (
              <section className="gap-table" aria-label="Skill gaps">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">{T.priorityList}</p>
                    <h3>{T.skillGaps}</h3>
                  </div>
                  <BarChart3 size={20} aria-hidden="true" />
                </div>
                {gaps.map((gap) => (
                  <div className="gap-row" key={gap.skill_id}>
                    <div>
                      <strong>{gap.skill_name}</strong>
                      <span>{gap.skill_category}</span>
                    </div>
                    <div className="bar-track" aria-hidden="true">
                      <span className="bar-demand" style={{ width: `${Math.round(gap.required_level * 100)}%` }} />
                      <span className="bar-current" style={{ width: `${Math.round(gap.current_level * 100)}%` }} />
                    </div>
                    <b>{Math.round(gap.gap * 100)}%</b>
                  </div>
                ))}
              </section>
            )}

            {/* Course recommendations */}
            {courses.length > 0 && (
              <section className="learning-plan" aria-label="Course recommendations">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">{T.nextActions}</p>
                    <h3>{T.recommendedCourses}</h3>
                  </div>
                  <BookOpenCheck size={20} aria-hidden="true" />
                </div>
                {courses.slice(0, 5).map((course, i) => (
                  <article key={course.course_id} className="plan-item">
                    <span>{i + 1}</span>
                    <div>
                      <h4>{course.course_title}</h4>
                      <p>
                        {course.provider}
                        {course.rating && (
                          <> · <Star size={12} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle' }} /> {course.rating}</>
                        )}
                        {course.price_usd !== undefined && course.price_usd !== null && (
                          <> · {course.price_usd === 0 ? T.free : `$${course.price_usd}`}</>
                        )}
                      </p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                        {T.covers} {course.covers_skills.join(', ')}
                      </p>
                    </div>
                    {course.url && (
                      <a href={course.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${course.course_title}`}>
                        <ExternalLink size={16} aria-hidden="true" />
                      </a>
                    )}
                  </article>
                ))}
              </section>
            )}

            {/* Empty state */}
            {apiMode === 'connected' && !analyzing && gaps.length === 0 && selectedRole && (
              <div style={{ padding: '48px', textAlign: 'center', opacity: 0.5 }}>
                <Sparkles size={32} />
                <p>{T.emptyGap(selectedRole)}</p>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  )
}

export default App
