import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { apiClient } from '@/shared/lib/apiClient'
import { useResumeStore } from '../../store/useResumeStore'
import { useEditorUIStore } from '../../store/useEditorUIStore'

import LeftNav from './LeftNav'
import FormPanel from './FormPanel'
import PreviewPanel from './PreviewPanel'
import { Toolbar } from './Toolbar'
import { RightSidebarUtils } from './RightSidebarUtils'
import { GlobalNavDrawer } from './GlobalNavDrawer'
import ResumeOnboarding from '../onboarding/ResumeOnboarding'
import styles from './EditorShell.module.css'

export default function EditorShell() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isTailored = id === 'new' && searchParams.get('tailored') === 'true'
  const resumeId = id === 'new' ? null : id
  
  const loadResume = useResumeStore(s => s.loadResume)
  const setDirty = useEditorUIStore(s => s.setDirty)
  
  // For tailored resumes or stashed resumes, skip onboarding
  const [showOnboarding, setShowOnboarding] = useState(id === 'new' && !isTailored && !localStorage.getItem('careerforge_unsaved_resume'))

  // Fetch resume if loading an existing one
  const { data: remoteResume, isLoading, isError } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async () => {
      if (!resumeId) return null
      const res = await apiClient.get(`/resumes/${resumeId}`)
      return res.data.data
    },
    enabled: !!resumeId,
    retry: false
  })

  const hasInitialized = useRef(false)

  // Synchronize fetched data into the central store and reset dirty state
  useEffect(() => {
    if (hasInitialized.current && id === 'new') return // Prevent double-trigger wipes for new resumes
    
    if (resumeId && remoteResume) {
      if (hasInitialized.current) return // Only load remote resume once
      hasInitialized.current = true
      
      console.log('[EditorShell] Loading remote resume:', resumeId)
      loadResume(remoteResume)
      setTimeout(() => setDirty(false), 50)
    } else if (!resumeId && id === 'new') {
      hasInitialized.current = true
      const stashed = localStorage.getItem('careerforge_unsaved_resume')
      
      if (stashed) {
        console.log('[EditorShell] Restoring stashed resume')
        try {
          const parsed = JSON.parse(stashed)
          loadResume({
            _id: null,
            templateId: searchParams.get('template') || 'modern-centered',
            title: parsed.title,
            personalInfo: parsed.data?.personalInfo,
            sections: parsed.data?.sections || [],
            customization: parsed.customization
          })
          localStorage.removeItem('careerforge_unsaved_resume')
        } catch (err) {
          console.error('[EditorShell] Failed to parse stashed resume:', err)
          loadResume(null)
        }
      } else if (isTailored) {
        const raw = sessionStorage.getItem('careerforge_tailored_resume')
        if (raw) {
          try {
            const tailored = JSON.parse(raw)
            console.log('[EditorShell] Loading tailored resume from session storage')
            loadResume({
              _id: null,
              templateId: searchParams.get('template') || 'modern-centered',
              title: tailored.jdRoleName ? `${tailored.jdRoleName} Resume` : 'Tailored Resume',
              personalInfo: tailored.personalInfo,
              sections: tailored.sections,
            })
            // Mark as loaded so we don't clear it on next render
            sessionStorage.removeItem('careerforge_tailored_resume')
          } catch (err) {
            console.error('[EditorShell] Failed to parse tailored resume:', err)
            loadResume(null)
          }
        } else {
          console.log('[EditorShell] Tailored data already loaded or missing from session')
        }
      } else {
        console.log('[EditorShell] Loading blank resume')
        loadResume(null)
      }
      setTimeout(() => setDirty(false), 50)
    }
  }, [resumeId, remoteResume, loadResume, setDirty, id, isTailored])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--surface)' }}>
        <Loader2 size={32} className="spin" color="var(--primary)" />
        <p style={{ color: 'var(--on-surface-variant)' }}>Loading resume...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--surface)' }}>
        <p style={{ color: 'var(--error)' }}>Failed to load the resume.</p>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', borderRadius: '4px' }}>Back to Dashboard</button>
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      <Toolbar />
      <div className={styles.body}>
        <LeftNav />
        <FormPanel />
        <PreviewPanel />
        <RightSidebarUtils />
      </div>
      {/* Onboarding overlay — shown for new resumes, dismissed after user chooses */}
      {showOnboarding && (
        <ResumeOnboarding onComplete={() => setShowOnboarding(false)} />
      )}
      <GlobalNavDrawer />
    </div>
  )
}
