import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/shared/components/Navbar/Navbar'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  const location = useLocation()
  const isEditor = location.pathname.startsWith('/resume/')

  return (
    <div className={styles.layout}>
      {!isEditor && <Navbar />}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
