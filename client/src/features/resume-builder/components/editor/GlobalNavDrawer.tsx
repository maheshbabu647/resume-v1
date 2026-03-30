import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, LogOut, Home, X } from 'lucide-react'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { Button } from '@/shared/components/Button/Button'
import styles from './GlobalNavDrawer.module.css'

export const GlobalNavDrawer = () => {
  const isOpen = useEditorUIStore((s) => s.globalNavOpen)
  const close = useEditorUIStore((s) => s.closeGlobalNav)
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    close()
    navigate('/login')
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.backdrop} onClick={close} />
      <aside className={styles.drawer}>
        <div className={styles.head}>
          <span className={styles.title}>Navigation</span>
          <button className={styles.closeBtn} onClick={close}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink} onClick={close}>
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/templates" className={styles.navLink} onClick={close}>
            <FileText size={18} />
            <span>Templates</span>
          </Link>
          <Link to="/dashboard" className={styles.navLink} onClick={close}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          
          <div className={styles.spacer} />
          
          <Button 
            variant="ghost" 
            className={styles.logoutBtn} 
            onClick={handleLogout}
            fullWidth
          >
            <LogOut size={18} />
            <span>Log out</span>
          </Button>
        </nav>
      </aside>
    </>
  )
}
