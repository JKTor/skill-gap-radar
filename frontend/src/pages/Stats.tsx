import { useEffect, useState } from 'react'
import { TrendingUp, Users, Calendar, RefreshCw, Rocket } from 'lucide-react'

const LAUNCH_DATE = new Date('2026-05-18')
function daysSinceLaunch() {
  const diff = Date.now() - LAUNCH_DATE.getTime()
  return Math.floor(diff / 86_400_000) + 1
}
import { getVisitStats, type VisitStats } from '../api'
import { useLang } from '../LangContext'

type ApiMode = 'checking' | 'connected' | 'mock'

export default function Stats({ apiMode }: { apiMode: ApiMode }) {
  const { T } = useLang()
  const [stats, setStats] = useState<VisitStats | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  function fetchStats() {
    setError(false)
    setLoading(true)
    getVisitStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (apiMode === 'connected') fetchStats()
  }, [apiMode])

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

      {apiMode === 'mock' && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>
          {T.backendOffline}
        </p>
      )}

      {error && apiMode !== 'mock' && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{T.statsError}</p>
          <button
            className="nav-tab"
            onClick={fetchStats}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} />
            {loading ? '…' : T.retry}
          </button>
        </div>
      )}

      {!stats && !error && apiMode !== 'mock' && (
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
              <Rocket size={28} />
              <span className="stats-number">{daysSinceLaunch()}</span>
              <span className="stats-label">{T.statDaysSinceLaunch}</span>
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
