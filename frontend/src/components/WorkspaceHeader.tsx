import type { ApiHealth, SkillGapAnalysis } from '../api'
import type { ApiMode } from '../hooks/useSkillGap'
import { useLang } from '../LangContext'

/** หัวของพื้นที่ทำงานฝั่งขวา — ตำแหน่งที่เลือก + สถานะ backend + คะแนนความพร้อม */
export default function WorkspaceHeader({
  apiMode,
  apiHealth,
  selectedRole,
  analysis,
  analyzing,
  readiness,
}: {
  apiMode: ApiMode
  apiHealth: ApiHealth | null
  selectedRole: string
  analysis: SkillGapAnalysis | null
  analyzing: boolean
  readiness: number | null
}) {
  const { T } = useLang()

  if (apiMode === 'checking') {
    return (
      <header className="workspace-header skeleton-workspace" aria-label="Loading analysis">
        <div>
          <span className="skeleton-line short" />
          <span className="skeleton-line title" />
          <span className="skeleton-line wide" />
        </div>
      </header>
    )
  }

  return (
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
  )
}
