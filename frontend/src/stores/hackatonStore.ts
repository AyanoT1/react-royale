import axiosSecure, { axiosInstance } from '@/utils/axiosSecure'
import { create } from 'zustand'
import type { Hackaton } from '@/types/types'

const baseUrl = '/api/hackatons'

interface HackatonState {
  hackatons: Hackaton[]
}

interface HackatonActions {
  fetchHackatons: () => Promise<Hackaton[]>
  createHackaton: (data: Omit<Hackaton, 'id'>) => Promise<Hackaton>
  updateHackaton: (id: string, data: Partial<Hackaton>) => Promise<Hackaton>
  deleteHackaton: (id: string) => Promise<void>
}

export const useHackatonStore = create<HackatonActions & HackatonState>()((set) => ({
  hackatons: [],

  fetchHackatons: () => {
    return axiosInstance.get<Hackaton[]>(baseUrl).then((response: { data: Hackaton[] }) => {
      set({ hackatons: response.data })
      return response.data
    })
  },
  createHackaton: (data: Omit<Hackaton, 'id'>) => {
    return axiosSecure.post<Hackaton>(baseUrl, data).then((response: { data: Hackaton }) => {
      set((state) => ({ hackatons: [...state.hackatons, response.data] }))
      return response.data
    })
  },
  updateHackaton: (id: string, data: Partial<Hackaton>) => {
    return axiosSecure
      .put<Hackaton>(`${baseUrl}/${id}`, data)
      .then((response: { data: Hackaton }) => {
        set((state) => ({
          hackatons: state.hackatons.map((hackaton) =>
            hackaton.id === id ? response.data : hackaton,
          ),
        }))
        return response.data
      })
  },
  deleteHackaton: (id: string) => {
    return axiosSecure.delete(`${baseUrl}/${id}`).then(() => {
      set((state) => ({
        hackatons: state.hackatons.filter((hackaton) => hackaton.id !== id),
      }))
    })
  },
}))
