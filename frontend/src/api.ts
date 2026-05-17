const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export type ApiHealth = { status: string; version: string }

export type SkillRead = { id: number; name: string; category: string }

export type JobTitle = { title: string; industry: string }

export type SkillGap = {
  skill_id: number
  skill_name: string
  skill_category: string
  required_level: number
  current_level: number
  gap: number
}

export type RecommendedCourse = {
  course_id: number
  course_title: string
  provider: string
  url?: string
  price_usd?: number
  rating?: number
  covers_skills: string[]
  relevance_score: number
}

export type SkillGapAnalysis = {
  user_id: number
  target_role: string
  matched_jobs: number
  gap_score: number
  gaps: SkillGap[]
  recommended_courses: RecommendedCourse[]
}

export type QuickSkillInput = { name: string; level: number }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

export const getHealth = () => request<ApiHealth>('/health')

export const getJobTitles = () => request<JobTitle[]>('/jobs/titles')

export const getSkills = () => request<SkillRead[]>('/skills/')

export const quickAnalysis = (target_role: string, skills: QuickSkillInput[]) =>
  request<SkillGapAnalysis>('/analysis/quick', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_role, skills }),
  })

export type VisitStats = {
  total: number
  today: number
  this_week: number
  daily: { date: string; count: number }[]
}

export const recordVisit = (page = 'home') =>
  request<{ recorded: boolean }>(`/visits/?page=${page}`, { method: 'POST' })

export const getVisitStats = () => request<VisitStats>('/visits/stats')
