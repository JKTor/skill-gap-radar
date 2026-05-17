import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const fetchMock = vi.fn()

describe('App', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', version: 'test' }),
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('renders the dashboard and reports backend health', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /Frontend Developer/i })).toBeInTheDocument()
    expect(screen.getByText(/Skill radar/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('ok')).toBeInTheDocument()
    })
  })

  it('switches target role from autocomplete results', () => {
    render(<App />)

    fireEvent.focus(screen.getByLabelText(/Target role/i))
    fireEvent.change(screen.getByLabelText(/Target role/i), { target: { value: 'Data' } })
    fireEvent.click(screen.getByRole('button', { name: /Data Analyst/i }))

    expect(screen.getByRole('heading', { name: /Data Analyst/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'SQL' })).toBeInTheDocument()
  })
})
