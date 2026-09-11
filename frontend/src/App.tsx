import { useState } from 'react'
import { Radar, Sparkles } from 'lucide-react'
import CourseList from './components/CourseList'
import GapTable from './components/GapTable'
import InsightPanel from './components/InsightPanel'
import RadarPanel from './components/RadarPanel'
import RolePicker from './components/RolePicker'
import SkillPicker from './components/SkillPicker'
import TopNav, { type Page } from './components/TopNav'
import WorkspaceHeader from './components/WorkspaceHeader'
import { useSkillGap } from './hooks/useSkillGap'
import { useLang } from './LangContext'
import HowToUse from './pages/HowToUse'
import Stats from './pages/Stats'
import './App.css'

/**
 * โครงของทั้งเว็บ — แถบบน + สามหน้า (วิธีใช้ / เรดาร์ / สถิติ)
 *
 * ไฟล์นี้ตั้งใจให้อ่านแล้วเห็นผังหน้าเว็บทั้งหมดในจอเดียว
 * ข้อมูลอยู่ใน hooks/useSkillGap.ts · หน้าตาแต่ละกล่องอยู่ใน components/
 */
function App() {
  const { T } = useLang()
  const [page, setPage] = useState<Page>('guide')
  const s = useSkillGap()

  return (
    <div className="page-wrapper">
      <TopNav page={page} onNavigate={setPage} />

      {page === 'guide' && <HowToUse onStart={() => setPage('radar')} />}
      {page === 'stats' && <Stats apiMode={s.apiMode} />}
      {page === 'radar' && (
        <main className="app-shell">
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

            <RolePicker
              apiMode={s.apiMode}
              industries={s.industries}
              selectedIndustry={s.selectedIndustry}
              onSelectIndustry={s.setSelectedIndustry}
              query={s.query}
              onQueryChange={s.setQuery}
              isMenuOpen={s.isRoleMenuOpen}
              onMenuOpenChange={s.setIsRoleMenuOpen}
              filteredTitles={s.filteredTitles}
              onChooseRole={s.chooseRole}
            />

            <SkillPicker
              apiMode={s.apiMode}
              skillQuery={s.skillQuery}
              onSkillQueryChange={s.setSkillQuery}
              filteredSkills={s.filteredSkills}
              selectedSkills={s.selectedSkills}
              onToggleSkill={s.toggleSkill}
            />
          </aside>

          <section className="workspace">
            <WorkspaceHeader
              apiMode={s.apiMode}
              apiHealth={s.apiHealth}
              selectedRole={s.selectedRole}
              analysis={s.analysis}
              analyzing={s.analyzing}
              readiness={s.readiness}
            />

            {s.gaps.length > 0 && (
              <div className="dashboard-grid">
                <RadarPanel gaps={s.gaps} radarKey={s.radarKey} />
                <InsightPanel
                  topGap={s.topGap}
                  readiness={s.readiness}
                  gapCount={s.gaps.length}
                />
              </div>
            )}

            {s.gaps.length > 0 && <GapTable gaps={s.gaps} />}
            {s.courses.length > 0 && <CourseList courses={s.courses} />}

            {s.apiMode === 'connected' && !s.analyzing && s.gaps.length === 0 && s.selectedRole && (
              <div style={{ padding: '48px', textAlign: 'center', opacity: 0.5 }}>
                <Sparkles size={32} />
                <p>{T.emptyGap(s.selectedRole)}</p>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  )
}

export default App
