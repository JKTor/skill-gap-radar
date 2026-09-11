import { Check, Search } from 'lucide-react'
import type { SkillRead } from '../api'
import type { ApiMode } from '../hooks/useSkillGap'
import { useLang } from '../LangContext'

/** ช่องเลือกทักษะที่ผู้ใช้มีอยู่แล้ว + ตัวกรองชื่อทักษะ (อยู่ในแถบซ้าย) */
export default function SkillPicker({
  apiMode,
  skillQuery,
  onSkillQueryChange,
  filteredSkills,
  selectedSkills,
  onToggleSkill,
}: {
  apiMode: ApiMode
  skillQuery: string
  onSkillQueryChange: (query: string) => void
  filteredSkills: SkillRead[]
  selectedSkills: string[]
  onToggleSkill: (name: string) => void
}) {
  const { T } = useLang()

  return (
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
              onChange={(e) => onSkillQueryChange(e.target.value)}
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
                  onClick={() => onToggleSkill(skill.name)}
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
  )
}
