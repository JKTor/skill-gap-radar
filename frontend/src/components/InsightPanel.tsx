import { Clock3, Target, TrendingUp } from 'lucide-react'
import type { SkillGap } from '../api'
import { useLang } from '../LangContext'

/** การ์ดสรุป 3 บรรทัดข้างวงเรดาร์ — ช่องว่างที่ใหญ่ที่สุด / ความพร้อม / แผนระยะสั้น */
export default function InsightPanel({
  topGap,
  readiness,
  gapCount,
}: {
  topGap: SkillGap | null
  readiness: number | null
  gapCount: number
}) {
  const { T } = useLang()

  return (
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
        <b>{T.focusSkills(Math.min(gapCount, 3))}</b>
      </div>
    </section>
  )
}
