import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Navbar } from '@/shared/components/Navbar/Navbar'
import { Footer } from '@/shared/components/Footer/Footer'
import { AuthRequireModal } from '@/shared/components/AuthRequireModal/AuthRequireModal'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  const location = useLocation()
  const isEditor = location.pathname.startsWith('/resume/')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authTitle, setAuthTitle] = useState('Log in to CareerForge')
  const [authSubtitle, setAuthSubtitle] = useState('Land the role you\'ve been working toward.')

  useEffect(() => {
    const handleHit = () => {
      setAuthTitle('Sign in to continue')
      setAuthSubtitle('Create a free account to save your work and use all CareerForge tools.')
      setAuthModalOpen(true)
    }
    window.addEventListener('guest-limit-hit', handleHit)
    return () => window.removeEventListener('guest-limit-hit', handleHit)
  }, [])

  return (
    <div className={styles.layout}>
      {!isEditor && <Navbar />}
      <main className={styles.content}>
        <Outlet />
      </main>
      {!isEditor && <Footer />}
      <AuthRequireModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={() => setAuthModalOpen(false)} 
        title={authTitle} 
        subtitle={authSubtitle} 
      />
    </div>
  )
}
