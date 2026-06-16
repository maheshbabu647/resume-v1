import { useEffect, useRef, useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileSignature, Target, LayoutGrid, BookOpen,
  Briefcase, ListChecks, Compass, Mic, Lock, ChevronLeft, ChevronRight,
  ChevronDown, Menu, X, LogOut, Plus, Search, Bell, HelpCircle, Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import styles from './AppShellLayout.module.css'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Cover Letters', icon: FileSignature, to: '/cover-letter' },
  { label: 'ATS Score & Tailor', icon: Target, to: '/jd-tailor' },
  { label: 'Templates', icon: LayoutGrid, to: '/templates' },
  { label: 'Insights', icon: BookOpen, to: '/blog' },
]

const SOON_ITEMS = [
  { label: 'Job Suggestions', icon: Briefcase },
  { label: 'Application Tracker', icon: ListChecks },
  { label: 'Skill Gap Planner', icon: Compass },
  { label: 'AI Mock Interviews', icon: Mic },
]

export const AppShellLayout = () => {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('cfp_sidebar_collapsed') === '1')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('cfp_sidebar_collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

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
    window.location.href = '/login'
  }

  return (
    <div className={styles.shell}>
      <div
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.sidebarHead}>
          <CfpLogo className={styles.sidebarLogo} />
        </div>

        <div className={styles.newResumeWrap}>
          <Link to="/templates" className={styles.newResumeBtn}>
            <Plus size={16} />
            <span className={styles.navLabel}>New resume</span>
          </Link>
        </div>

        <div className={styles.sidebarBody}>
          <div className={styles.navSection}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                  <span className={styles.navIcon}><Icon size={18} /></span>
                  <span className={styles.navLabel}>{item.label}</span>
                </NavLink>
              )
            })}
          </div>

          <div className={styles.navSection}>
            <div className={styles.navDivider}>Coming soon</div>
            {SOON_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className={`${styles.navItem} ${styles.navItemSoon}`}>
                  <span className={styles.navIcon}><Icon size={18} /></span>
                  <span className={styles.navLabel}>{item.label}</span>
                  <Lock size={13} className={styles.navLock} />
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.sidebarFoot}>
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            <span className={styles.navLabel}>{collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>
      </div>

      <div
        className={`${styles.backdrop} ${mobileOpen ? styles.backdropVisible : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button className={styles.searchBar} type="button">
              <Search size={15} />
              <span>Search resumes, cover letters, templates&hellip;</span>
              <kbd className={styles.kbd}>&#8984;K</kbd>
            </button>
          </div>

          <div className={styles.topbarRight}>
            {isAuthenticated && user ? (
              <>
                <button className={styles.iconBtn} aria-label="Notifications">
                  <Bell size={18} />
                  <span className={styles.notifDot} />
                </button>
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
              </>
            ) : (
              <>
                <Link to="/login" className={styles.signInLink}>Log in</Link>
                <Link to="/register" className={styles.saveBtn}>
                  <span className={styles.saveBtnFull}>Sign up &mdash; Save your work</span>
                  <span className={styles.saveBtnShort}>Sign up</span>
                </Link>
              </>
            )}
          </div>
        </header>

        {!isAuthenticated && (
          <div className={styles.anonBanner}>
            <Sparkles size={14} className={styles.anonBannerIcon} />
            <span>
              You&apos;re trying CareerForgePro. <strong>Sign up to save your work</strong> &mdash; it takes 30 seconds.
            </span>
            <Link to="/register" className={styles.anonBannerCta}>Save my work &rarr;</Link>
          </div>
        )}

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
