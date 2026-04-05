import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, LogOut, User as UserIcon, Menu, X, Target, FileSignature, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { useUsage } from '@/core/hooks/useUsage'
import { Button } from '@/shared/components/Button/Button'
import styles from './Navbar.module.css'

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { plan } = useUsage()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/login')
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={styles.topbar}>
      <Link to="/" className={styles.brandLink} onClick={closeMenu}>
        <div className={styles.brand}>
          <div className={styles.logo}>CF</div>
          <span className={styles.brandName}>CareerForge</span>
        </div>
      </Link>

      {/* Mobile Toggle */}
      <button className={styles.menuToggle} onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop & Mobile Nav */}
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
        {isAuthenticated && (
          <NavLink to="/jd-tailor" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <Target size={15} />
            JD Tailor
          </NavLink>
        )}
        {isAuthenticated && (
          <NavLink to="/cover-letter" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <FileSignature size={15} />
            Cover Letter
          </NavLink>
        )}
        <NavLink to="/pricing" onClick={closeMenu} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <CreditCard size={15} />
          Pricing
        </NavLink>
        
        {/* Mobile Auth/Info (Bottom) */}
        <div className={styles.mobileAuth}>
          {isAuthenticated && user ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-secondary)', fontWeight: 'bold' }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--on-surface)' }}>{user.name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--on-surface-variant)' }}>{user.email}</span>
                </div>
              </div>
              <Button variant="ghost" fullWidth onClick={handleLogout} style={{ justifyContent: 'flex-start', color: 'var(--error)' }}>
                <LogOut size={16} /> Sign out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                <Button variant="ghost" fullWidth>Log in</Button>
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <Button fullWidth>Get started free</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Desktop User Area */}
      <div className={styles.userArea}>
        {isAuthenticated && user ? (
          <>
            <div className={styles.avatar}>
              {user.name?.charAt(0)?.toUpperCase() || <UserIcon size={16} />}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userPlan}>
                {plan === 'closer' ? 'Closer' : plan === 'hustler' ? 'Hustler' : 'Seeker'}
              </span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div className={styles.authButtons}>
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Backdrop for Mobile Menu */}
      {isMenuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </header>
  )
}
