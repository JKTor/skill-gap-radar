import { Sparkles } from 'lucide-react'
import type { SkillGap } from '../api'
import { useLang } from '../LangContext'

/**
 * วงเรดาร์ทักษะ 5 ตัวแรก
 *
 * `radarKey` เปลี่ยนเมื่อไหร่ React จะสร้าง node ใหม่ทั้งชุด → animation เริ่มใหม่
 * (ตั้งใจให้เป็นแบบนั้น อย่าเอาออก)
 */
export default function RadarPanel({
  gaps,
  radarKey,
}: {
  gaps: SkillGap[]
  radarKey: string
}) {
  const { T } = useLang()

  return (
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
  )
}
