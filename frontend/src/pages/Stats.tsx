import { useEffect, useState } from 'react'
import { Users, RefreshCw } from 'lucide-react'
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
        </div>
      )}

      {stats && (
        <div className="stats-cards">
          <div className="stats-card accent">
            <Users size={28} />
            <span className="stats-number">{stats.total.toLocaleString()}</span>
            <span className="stats-label">{T.statTotal}</span>
          </div>
        </div>
      )}
    </div>
  )
}
