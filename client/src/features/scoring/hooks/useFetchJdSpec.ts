import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient'
import { preprocessJD } from '../lib/jdPreprocessor'
import { useJdMatchStore } from '../store/useJdMatchStore'
import type { JDSpec } from '../types/scoring.types'

/**
 * Fetches the weighted JD-Spec for a pasted/uploaded JD (one LLM call, cached server-side).
 * On success it stores the spec + raw JD text; the live formula scores from there with no
 * further calls. The raw JD text is preserved so "Change JD" can prefill it.
 */
export function useFetchJdSpec() {
  const queryClient = useQueryClient()
  const setJd = useJdMatchStore((s) => s.setJd)
  const setStatus = useJdMatchStore((s) => s.setStatus)

  return useMutation<JDSpec, Error, string>({
    mutationFn: async (jdText) => {
      setStatus('loading')
      const res = await apiClient.post('/ai/jd-spec', { jdText: preprocessJD(jdText) })
      return res.data.data as JDSpec
    },
    onSuccess: (spec, jdText) => {
      setJd(jdText, spec)
      queryClient.invalidateQueries({ queryKey: ['usage'] })
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', {
          detail: err?.response?.data?.data ?? { feature: 'jdScore' },
        }))
      }
      setStatus('error', code === 'QUOTA_EXCEEDED' ? 'quota' : 'Failed to analyze the job description. Please try again.')
    },
  })
}
