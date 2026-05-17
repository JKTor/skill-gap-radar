import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'
import { getVisitStats, type VisitStats } from '../api'
import { useLang } from '../LangContext'

export default function Stats() {
  const { T } = useLang()
  const [stats, setStats] = useState<VisitStats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getVisitStats()
      .then(setStats)
      .catch(() => setError(true))
  }, [])

  const maxCount = stats ? Math.max(...stats.daily.map((d) => d.count), 1) : 1

  return (
    <div className="guide-shell">
      <header className="guide-hero" style={{ paddingBottom: 32 }}>
        <span className="brand-mark" style={{ width: 56, height: 56 }}>
          <Users size={28} aria-hidden="true" />
        </span>
        <h1>{T.statsTitle}</h1>
        <p className="guide-subtitle">{T.statsSubtitle}</p>
      </header>

      {error && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>
          {T.statsError}
        </p>
      )}

      {!stats && !error && (
        <div className="skeleton-block" style={{ maxWidth: 560, margin: '0 auto' }}>
          <span className="skeleton-line title" />
          <span className="skeleton-line wide" />
          <span className="skeleton-line input" style={{ marginTop: 24 }} />
        </div>
      )}

      {stats && (
        <>
          {/* ── 3 big numbers ─────────────────────────────────────── */}
          <div className="stats-cards">
            <div className="stats-card">
              <TrendingUp size={28} />
              <span className="stats-number">{stats.total.toLocaleString()}</span>
              <span className="stats-label">{T.statTotal}</span>
            </div>
            <div className="stats-card accent">
              <Calendar size={28} />
              <span className="stats-number">{stats.today.toLocaleString()}</span>
              <span className="stats-label">{T.statToday}</span>
            </div>
            <div className="stats-card">
              <BarChart3 size={28} />
              <span className="stats-number">{stats.this_week.toLocaleString()}</span>
              <span className="stats-label">{T.statWeek}</span>
            </div>
          </div>

          {/* ── Bar chart 7 days ──────────────────────────────────── */}
          <section className="guide-section" style={{ marginTop: 40 }}>
            <h2>{T.statChart}</h2>
            <div className="visit-chart">
              {stats.daily.map((d) => (
                <div key={d.date} className="visit-bar-col">
                  <span className="visit-bar-count">{d.count}</span>
                  <div className="visit-bar-track">
                    <div
                      className="visit-bar-fill"
                      style={{ height: `${Math.round((d.count / maxCount) * 100)}%` }}
                    />
                  </div>
                  <span className="visit-bar-label">{d.date}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
