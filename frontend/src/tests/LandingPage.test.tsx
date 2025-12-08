import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage/LandingPage'
import { useHackatonStore } from '@/stores/hackatonStore'

vi.mock('@/stores/hackatonStore')
vi.mock('@/components/Hero', () => ({
  Hero: () => <div>Hero Component</div>,
}))
vi.mock('@/components/HackatonCards', () => ({
  HackatonCards: () => <div>Hackaton Cards</div>,
}))
vi.mock('@/pages/LandingPage/AboutSection', () => ({
  AboutSection: () => <div>About Section</div>,
}))
vi.mock('@/pages/LandingPage/CreateHackatonSection', () => ({
  CreateHackatonSection: () => <div>Create Hackaton Section</div>,
}))

describe('LandingPage', () => {
  beforeEach(() => {
    vi.mocked(useHackatonStore).mockReturnValue([])
  })

  it('should render main sections', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Hero Component')).toBeInTheDocument()
    expect(screen.getByText('About Section')).toBeInTheDocument()
    expect(screen.getByText('Create Hackaton Section')).toBeInTheDocument()
  })

  it('should render active hackathons heading', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Active hackathons')).toBeInTheDocument()
    expect(screen.getByText('Jump in and start building React components')).toBeInTheDocument()
  })

  it('should render voting period heading', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Voting period')).toBeInTheDocument()
    expect(screen.getByText('Cast your votes for the best submissions')).toBeInTheDocument()
  })

  it('should render past competitions heading', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Past competitions')).toBeInTheDocument()
  })

  it('should show empty state when no active hackathons', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
    expect(screen.getByText('No competitions running right now')).toBeInTheDocument()
  })
})
