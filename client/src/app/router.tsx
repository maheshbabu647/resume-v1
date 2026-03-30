import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AuthGuard } from '@/core/auth/AuthGuard'
import { MainLayout } from '@/shared/layouts/MainLayout'

const HomePage       = lazy(() => import('@/features/home/HomePage'))
const LoginPage      = lazy(() => import('@/features/auth-pages/LoginPage'))
const RegisterPage   = lazy(() => import('@/features/auth-pages/RegisterPage'))
const VerifyEmailPage = lazy(() => import('@/features/auth-pages/VerifyEmailPage'))
const AuthCallback   = lazy(() => import('@/features/auth-pages/AuthCallback'))
const TemplatesPage  = lazy(() => import('@/features/templates/TemplatesPage'))
const PricingPage    = lazy(() => import('@/features/pricing/PricingPage'))
const Dashboard   = lazy(() => import('@/features/dashboard/Dashboard'))
const EditorShell = lazy(() => import('@/features/resume-builder/components/editor/EditorShell'))
const JDTailorPage     = lazy(() => import('@/features/jd-tailor/JDTailorPage'))
const CoverLetterPage  = lazy(() => import('@/features/cover-letter/CoverLetterPage'))

const Fallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--surface)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--outline-variant)', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<Fallback />}><HomePage /></Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<Fallback />}><LoginPage /></Suspense>,
  },
  {
    path: '/register',
    element: <Suspense fallback={<Fallback />}><RegisterPage /></Suspense>,
  },
  {
    path: '/verify-email',
    element: <Suspense fallback={<Fallback />}><VerifyEmailPage /></Suspense>,
  },
  {
    path: '/auth/callback',
    element: <Suspense fallback={<Fallback />}><AuthCallback /></Suspense>,
  },
  {
    element: <MainLayout />,
    children: [
      { 
        path: 'templates', 
        element: <Suspense fallback={<Fallback />}><TemplatesPage /></Suspense> 
      },
      {
        path: 'pricing',
        element: <Suspense fallback={<Fallback />}><PricingPage /></Suspense>
      },
      {
        element: <AuthGuard />,
        children: [
          { path: 'dashboard',     element: <Suspense fallback={<Fallback />}><Dashboard /></Suspense> },
          { path: 'jd-tailor',     element: <Suspense fallback={<Fallback />}><JDTailorPage /></Suspense> },
          { path: 'cover-letter',  element: <Suspense fallback={<Fallback />}><CoverLetterPage /></Suspense> },
          { path: 'resume/:id',    element: <Suspense fallback={<Fallback />}><EditorShell /></Suspense> },
        ]
      }
    ],
  },
])
