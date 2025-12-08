import axiosSecure, { axiosInstance } from '@/utils/axiosSecure'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Credentials, UserData } from '@/types/types'

type LoginResponse = {
  token?: string
  user?: Record<string, unknown>
}

interface AuthState {
  user: UserData | null
  token: string | null
}

interface AuthActions {
  login: (credentials: Credentials) => Promise<LoginResponse>
  restoreLogin: () => Promise<void>
  logout: () => Promise<void>
  signup: (credentials: Credentials) => Promise<LoginResponse>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (credentials: Credentials) => {
        const response = await axiosInstance.post('/api/login', credentials)
        const csrfToken = response.headers['x-csrf-token']

        if (csrfToken) {
          localStorage.setItem('csrfToken', csrfToken)
        }

        const user = {
          id: '',
          username: response.data.username,
          name: response.data.name,
          submissions: [],
        }
        set({ user, token: response.data.token })
        return response.data
      },
      restoreLogin: async () => {
        try {
          const response = await axiosSecure.get('/api/login/me')
          const user = response.data as UserData
          set({ user, token: null })
        } catch {
          set({ user: null, token: null })
        }
      },
      logout: async () => {
        try {
          await axiosInstance.post('/api/login/logout')
        } finally {
          localStorage.removeItem('csrfToken')
          localStorage.removeItem('auth-storage')
          set({ user: null, token: null })
        }
      },
      signup: async (credentials: Credentials) => {
        const response = await axiosInstance.post('/api/signup', credentials)
        const csrfToken = response.headers['x-csrf-token']

        if (csrfToken) {
          localStorage.setItem('csrfToken', csrfToken)
        }

        const user = {
          id: '',
          username: response.data.username,
          name: response.data.name,
          submissions: [],
        }
        set({ user, token: response.data.token })
        return response.data
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
)
