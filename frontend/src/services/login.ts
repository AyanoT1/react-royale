import axiosSecure, { axiosInstance } from '@/utils/axiosSecure'
import type { Credentials } from '@/types/types'

type LoginResponse = {
  token?: string
  user?: Record<string, unknown>
}

const login = async (credentials: Credentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/api/login', credentials)

  const csrfToken = response.headers['x-csrf-token']

  if (csrfToken) {
    localStorage.setItem('csrfToken', csrfToken)
  }

  return response.data
}

const restoreLogin = async (): Promise<LoginResponse | null> => {
  try {
    const response = await axiosSecure.get('/api/login/me')
    return response.data
  } catch {
    return null
  }
}

const logout = async (): Promise<void> => {
  await axiosInstance.post('/api/login/logout')
  localStorage.removeItem('csrfToken')
}

const signup = async (credentials: Credentials): Promise<LoginResponse> => {
  const response = await axiosSecure.post('/api/users', credentials)
  return response.data
}

export const loginService = {
  login,
  restoreLogin,
  logout,
  signup,
}
