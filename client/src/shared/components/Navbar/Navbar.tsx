import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, FileText, LogOut, Menu, X, Target, FileSignature, BookOpen, Sparkles, ChevronDown, HelpCircle } from 'lucide-react'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import { Button } from '@/shared/components/Button/Button'
import styles from './Navbar.module.css'

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!userMenuOpen) return
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [userMenuOpen])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    setUserMenuOpen(false)
    window.location.href = '/login'
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setUserMenuOpen(false)
  }

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
          <div className={styles.userMenuWrap} ref={userMenuRef}>
            <button
              className={styles.userMenuBtn}
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-expanded={userMenuOpen}
            >
              <div className={styles.avatar}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <span className={styles.userName}>{user.name}</span>
              <ChevronDown size={14} className={`${styles.chevron} ${userMenuOpen ? styles.chevronOpen : ''}`} />
            </button>

            {userMenuOpen && (
              <div className={styles.userDropdown}>
                <div className={styles.userDropdownHead}>
                  <div className={styles.avatar}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  <div>
                    <div className={styles.dropdownName}>{user.name}</div>
                    <div className={styles.dropdownEmail}>{user.email}</div>
                  </div>
                </div>
                <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link to="/contact" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                  <HelpCircle size={15} /> Help &amp; support
                </Link>
                <div className={styles.dropdownDivider} />
                <button className={styles.dropdownItemDanger} onClick={handleLogout}>
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
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
