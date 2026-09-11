import { BarChart3 } from 'lucide-react'
import type { SkillGap } from '../api'
import { useLang } from '../LangContext'

/** ตารางช่องว่างทักษะเรียงตามความสำคัญ — แถบยาว = ตลาดต้องการ, แถบทึบ = ระดับที่มี */
export default function GapTable({ gaps }: { gaps: SkillGap[] }) {
  const { T } = useLang()

  return (
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
  )
}
