import { useCallback, useEffect, useMemo, useState } from 'react'
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
} from '../api'

export type ApiMode = 'checking' | 'connected' | 'mock'

/**
 * สถานะทั้งหมดของหน้า Radar — โหลดข้อมูล, วิเคราะห์อัตโนมัติ, และค่าที่คำนวณต่อ
 *
 * แยกออกจากส่วนแสดงผลเพื่อให้ตัว component อ่านง่ายขึ้น: ไฟล์นี้ตอบว่า "ข้อมูลมาจากไหน
 * และเปลี่ยนเมื่อไหร่" ส่วนไฟล์ใน components/ ตอบว่า "หน้าตาเป็นยังไง" อย่างเดียว
 */
export function useSkillGap() {
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null)
  const [apiMode, setApiMode] = useState<ApiMode>('checking')
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([])
  const [allSkills, setAllSkills] = useState<SkillRead[]>([])
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

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
        const today = new Date().toISOString().slice(0, 10)
        if (localStorage.getItem('visited') !== today) {
          recordVisit('home').catch(() => {})
          localStorage.setItem('visited', today)
        }
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

  const toggleSkill = useCallback((name: string) => {
    setSelectedSkills((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    )
  }, [])

  return {
    apiHealth, apiMode, analysis, analyzing,
    selectedRole, query, setQuery,
    selectedSkills, isRoleMenuOpen, setIsRoleMenuOpen,
    selectedIndustry, setSelectedIndustry,
    skillQuery, setSkillQuery,
    filteredTitles, industries, filteredSkills,
    gaps, courses, radarKey, readiness, topGap,
    chooseRole, toggleSkill,
  }
}
