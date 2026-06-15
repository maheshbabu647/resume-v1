import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, FileText, LogOut, User as UserIcon, Menu, X, Target, FileSignature, BookOpen, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import { Button } from '@/shared/components/Button/Button'
import styles from './Navbar.module.css'

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    window.location.href = '/login'
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`${styles.topbar} ${scrolled ? styles.scrolled : ''}`}>
      <CfpLogo onClick={closeMenu} />

      <button className={styles.menuToggle} onClick={() => setIsMenuOpen((v) => !v)} aria-label="Toggle menu">
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        <NavLink to="/templates" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <FileText size={15} />
          Templates
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <LayoutDashboard size={15} />
            Dashboard
          </NavLink>
        )}
        <NavLink to="/jd-tailor" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <Target size={15} />
          ATS Score &amp; Tailor
        </NavLink>
        <NavLink to="/cover-letter" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <FileSignature size={15} />
          Cover Letter
        </NavLink>
        <NavLink to="/blog" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <BookOpen size={15} />
          Insights
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/admin/insights" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} title="Admin: write an article">
            <Sparkles size={15} />
            Write
          </NavLink>
        )}

        <div className={styles.mobileAuth}>
          {isAuthenticated && user ? (
            <div className={styles.mobileUserBlock}>
              <div className={styles.mobileUserRow}>
                <div className={styles.avatar}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                <div>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
              </div>
              <Button variant="ghost" fullWidth onClick={handleLogout} className={styles.logoutMobile}>
                <LogOut size={16} /> Sign out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className={styles.signInLink}>Sign in</Link>
              <Link to="/register" onClick={closeMenu} className={styles.ctaBtn}>Get started free</Link>
            </>
          )}
        </div>
      </nav>

      <div className={styles.userArea}>
        {isAuthenticated && user ? (
          <>
            <div className={styles.avatar}>
              {user.name?.charAt(0)?.toUpperCase() || <UserIcon size={16} />}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.signInLink}>Sign in</Link>
            <Link to="/register" className={styles.ctaBtn}>Get started free</Link>
          </div>
        )}
      </div>

      {isMenuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </header>
  )
}
