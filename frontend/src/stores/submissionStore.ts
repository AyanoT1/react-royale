import axiosSecure, { axiosInstance } from '@/utils/axiosSecure'
import { create } from 'zustand'
import type { Submission } from '@/types/types'

const baseUrl = '/api/submissions'

interface SubmissionState {
  submissions: Submission[]
}

interface SubmissionActions {
  fetchSubmissions: () => Promise<Submission[]>
  createSubmission: (data: Omit<Submission, 'id' | 'hasVoted'>) => Promise<Submission>
  updateSubmission: (id: string, data: Partial<Submission>) => Promise<Submission>
  deleteSubmission: (id: string) => Promise<void>
  voteSubmission: (id: string, changeVote?: boolean) => Promise<Submission>
}

export const useSubmissionStore = create<SubmissionState & SubmissionActions>()((set) => ({
  submissions: [],

  fetchSubmissions: () => {
    return axiosSecure.get<Submission[]>(baseUrl).then((response) => {
      set({ submissions: response.data })
      return response.data
    }).catch(() => {
      // Fallback to regular axios if not authenticated
      return axiosInstance.get<Submission[]>(baseUrl).then((response) => {
        set({ submissions: response.data })
        return response.data
      })
    })
  },

  createSubmission: (data: Omit<Submission, 'id' | 'hasVoted'>) => {
    return axiosSecure.post<Submission>(baseUrl, data).then((response) => {
      set((state) => ({ submissions: [...state.submissions, response.data] }))
      return response.data
    })
  },

  updateSubmission: (id: string, data: Partial<Submission>) => {
    return axiosSecure.put<Submission>(`${baseUrl}/${id}`, data).then((response) => {
      set((state) => ({
        submissions: state.submissions.map((sub) => (sub.id === id ? response.data : sub)),
      }))
      return response.data
    })
  },

  deleteSubmission: (id: string) => {
    return axiosSecure.delete(`${baseUrl}/${id}`).then(() => {
      set((state) => ({
        submissions: state.submissions.filter((sub) => sub.id !== id),
      }))
    })
  },

  voteSubmission: (id: string, changeVote?: boolean) => {
    return axiosSecure.post<Submission>(`${baseUrl}/${id}/vote`, { changeVote }).then((response) => {
      // If changing vote, we need to update both the previous and new submissions
      // The backend handles this, so we need to refetch all submissions to get accurate vote counts
      set((state) => ({
        submissions: state.submissions.map((sub) =>
          sub.id === id ? response.data : sub
        ),
      }))
      return response.data
    })
  },
}))
