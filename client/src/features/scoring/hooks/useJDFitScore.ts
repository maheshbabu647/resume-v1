import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/lib/apiClient'
import type { JDFitScore } from '../types/scoring.types'

interface AnalyzePayload {
  serializedResume: string
  preprocessedJD: string
}

export const useJDFitScore = () => {
  const queryClient = useQueryClient()
  return useMutation<JDFitScore, Error, AnalyzePayload>({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/ai/analyze-jd', payload)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage'] })
    }
  })
}
