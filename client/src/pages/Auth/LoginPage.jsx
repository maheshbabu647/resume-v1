import React, { useEffect, Suspense, useState } from 'react'; // Make sure useEffect is imported
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthContext from '@/hooks/useAuth.js';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleLoginButton from '@/components/Auth/GoogleLoginButton.jsx';

const LoginForm = React.lazy(() => import('@/components/Auth/LoginForm.jsx'));

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Destructure the new clearAuthError function from the context
  const { signin, error: authError, isAuthenticated, clearAuthError, resendVerificationEmail } = useAuthContext();

   const [isSubmitting, setIsSubmitting] = useState(false);

  // --- MODIFICATION START ---
  // Add this useEffect to clear errors when the page loads
  useEffect(() => {
    if (authError) {
      clearAuthError();
    }
  }, [clearAuthError]);
  // --- MODIFICATION END ---


  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (credentials) => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      const user = await signin(credentials);
    
      if (user) {
        if (from.includes('/verify-email/')) {
          navigate(from, { replace: true });
        }
        else if (!user.isVerified) {
          await resendVerificationEmail({ userEmail: user.userEmail });
          navigate('/verify-email', { replace: true, state: { userEmail: user.userEmail } });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground" aria-busy="true" aria-live="polite">
        <LoadingSpinner size="large" label="Redirecting..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login | CareerForge</title>
        <meta name="description" content="Login to your CareerForge account to access AI-powered resume building tools, manage your applications, and more." />
      </Helmet>

      <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent-purple/10 rounded-full blur-2xl"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tr from-accent-pink/10 to-primary/10 rounded-full blur-2xl"
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-success/10 to-accent-purple/10 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-card/80 backdrop-blur-xl text-card-foreground shadow-2xl rounded-2xl border border-border/50">
            <CardHeader className="text-center p-6 sm:p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                className="mx-auto mb-4"
              >
                 <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-accent-purple to-accent-pink text-transparent bg-clip-text">
                    CareerForge
                 </Link>
              </motion.div>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome Back!</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Sign in to continue to your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 pt-0">
              <Suspense fallback={
                <div className="flex justify-center items-center h-40">
                  <LoadingSpinner label="Loading form..." />
                </div>
              }>
                <LoginForm
                  onSubmit={handleLogin}
                  isLoading={isSubmitting}
                  apiError={authError}
                />
              </Suspense>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <GoogleLoginButton />

              <div className="mt-4 text-center text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center p-6 sm:p-8 pt-2">
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default LoginPage;