import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { getHealth, getJobTitles, getSkills, quickAnalysis } from './api'
import { LangProvider } from './LangContext'
import { ThemeProvider } from './ThemeContext'

vi.mock('./api', () => ({
  getHealth: vi.fn(),
  getJobTitles: vi.fn(),
  getSkills: vi.fn(),
  quickAnalysis: vi.fn(),
}))

const healthMock = vi.mocked(getHealth)
const jobTitlesMock = vi.mocked(getJobTitles)
const skillsMock = vi.mocked(getSkills)
const quickAnalysisMock = vi.mocked(quickAnalysis)

function renderApp() {
  return render(
    <ThemeProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </ThemeProvider>,
  )
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    healthMock.mockResolvedValue({ status: 'ok', version: '0.1.0' })
    jobTitlesMock.mockResolvedValue([{ title: 'Data Scientist', industry: 'banking' }])
    skillsMock.mockResolvedValue([{ id: 1, name: 'Python', category: 'programming' }])
    quickAnalysisMock.mockResolvedValue({
      user_id: 0,
      target_role: 'Data Scientist',
      matched_jobs: 1,
      gap_score: 0.5,
      gaps: [],
      recommended_courses: [],
    })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders the HowToUse page without crashing', () => {
    renderApp()

    expect(screen.getByRole('heading', { name: 'Skill-Gap Radar' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'เว็บนี้คืออะไร?' })).toBeInTheDocument()
  })

  it('moves to the radar page when the CTA is clicked', async () => {
    renderApp()

    fireEvent.click(screen.getAllByRole('button', { name: /เริ่มใช้งานเลย/i })[0])

    await waitFor(() => {
      expect(screen.getByLabelText('Skill-Gap Radar controls')).toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'วิเคราะห์ทักษะ' })).toBeInTheDocument()
  })

  it('changes nav text from Thai to English when language is toggled', () => {
    renderApp()

    expect(screen.getAllByRole('button', { name: /วิธีใช้/i })[0]).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Switch language' }))

    expect(screen.getByRole('button', { name: /How to Use/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Analyse Skills/i })).toBeInTheDocument()
  })

  it('sets data-theme="dark" when the theme toggle is clicked', () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('falls back to mock mode when the API fails without crashing', async () => {
    healthMock.mockRejectedValue(new Error('API offline'))

    renderApp()
    fireEvent.click(screen.getAllByRole('button', { name: /เริ่มใช้งานเลย/i })[0])

    await waitFor(() => {
      expect(screen.getByText('Mock mode')).toBeInTheDocument()
    })
    expect(screen.getByText(/Backend ออฟไลน์/i)).toBeInTheDocument()
  })
})
