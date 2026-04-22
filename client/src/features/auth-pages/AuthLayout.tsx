import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, TrendingUp, Users, Star, ShieldCheck, Zap } from 'lucide-react'
import { useTheme } from '@/shared/providers/ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface AuthLayoutProps {
  children: React.ReactNode
  headline: string
  points: string[]
}

const socialProof = [
  { initials: 'AK', bg: 'bg-violet-500' },
  { initials: 'PR', bg: 'bg-emerald-500' },
  { initials: 'SM', bg: 'bg-blue-500' },
  { initials: 'VR', bg: 'bg-amber-500' },
]

export function AuthLayout({ children, headline, points }: AuthLayoutProps) {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex bg-background selection:bg-indigo-100 selection:text-indigo-900">

      {/* â”€â”€ Left panel (desktop only) â”€â”€ */}
      <div className="hidden lg:flex w-[460px] shrink-0 flex-col relative overflow-hidden bg-[#0A0C10]">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-violet-600/20" />
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative flex flex-col h-full p-12">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Sparkles size={20} className="text-white fill-white/20" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CareerForge</span>
          </Link>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-4xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                {headline}
              </h2>

              <ul className="space-y-5 mb-12">
                {points.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-4 text-slate-300"
                  >
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-[15px] font-medium leading-tight">{p}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Social proof Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-3">
                    {socialProof.map(({ initials, bg }) => (
                      <div
                        key={initials}
                        className={`h-9 w-9 rounded-full border-2 border-[#0A0C10] flex items-center justify-center text-white text-[10px] font-bold ${bg} ring-1 ring-white/10`}
                      >
                        {initials}
                      </div>
                    ))}
                    <div className="h-9 w-9 rounded-full border-2 border-[#0A0C10] bg-slate-800 flex items-center justify-center text-white text-[10px] font-bold ring-1 ring-white/10">
                      +12k
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => <Star key={n} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
                
                <div className="space-y-2.5">
                   <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                    <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
                      <TrendingUp size={14} />
                    </div>
                    <span>Avg. ATS score improved by <strong className="text-white font-semibold">+31 points</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                    <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                      <ShieldCheck size={14} />
                    </div>
                    <span>Trusted by <strong className="text-white font-semibold">12,400+</strong> ambitious students</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom legal */}
          <div className="text-slate-500 text-[11px] font-medium flex items-center gap-4 mt-auto">
            <span>© 2026 CareerForge</span>
            <div className="flex gap-3">
              <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Right panel (form) â”€â”€ */}
      <div className="flex-1 flex flex-col relative">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-10">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-foreground">CareerForge</span>
          </Link>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:bg-muted/50 rounded-xl"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-slate-50/30 dark:bg-slate-950/30">
          <motion.div
            className="w-full max-w-[400px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// â”€â”€ Google OAuth Button â”€â”€
export function GoogleOAuthButton({ guestId, referralCode }: { guestId?: string | null; referralCode?: string }) {
  const queryParams = new URLSearchParams()
  if (guestId) queryParams.append('guestId', guestId)
  if (referralCode) queryParams.append('ref', referralCode)
  const qs = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000/v1'

  return (
    <a
      href={`${apiBase}/auth/google${qs}`}
      className="flex items-center justify-center gap-3 w-full h-11 rounded-xl border border-border bg-background hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[14px] font-semibold text-foreground shadow-sm hover:shadow-md"
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </a>
  )
}

// â”€â”€ Auth divider â”€â”€
export function AuthDivider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
      <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">or</span>
      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}
