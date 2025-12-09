import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ user: null, token: null })
  })

  it('should have initial state with null user and token', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('should expose login action', () => {
    const state = useAuthStore.getState()
    expect(state.login).toBeDefined()
    expect(typeof state.login).toBe('function')
  })

  it('should expose logout action', () => {
    const state = useAuthStore.getState()
    expect(state.logout).toBeDefined()
    expect(typeof state.logout).toBe('function')
  })

  it('should expose signup action', () => {
    const state = useAuthStore.getState()
    expect(state.signup).toBeDefined()
    expect(typeof state.signup).toBe('function')
  })

  it('should expose restoreLogin action', () => {
    const state = useAuthStore.getState()
    expect(state.restoreLogin).toBeDefined()
    expect(typeof state.restoreLogin).toBe('function')
  })
})
