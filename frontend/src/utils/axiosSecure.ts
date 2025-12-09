import axios from 'axios'

// Base axios instance with base URL configured
export const axiosInstance = axios.create({
  baseURL: import.meta.env.BASE_URL,
})

// Secure axios instance with CSRF token handling
const axiosSecure = axios.create({
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true,
})

axiosSecure.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem('csrfToken')
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})

export default axiosSecure
