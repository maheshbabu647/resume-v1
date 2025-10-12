import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthContext from '@/hooks/useAuth.js';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleLoginButton from '@/components/Auth/GoogleLoginButton.jsx';

const SignupForm = React.lazy(() => import('@/components/Auth/SignupForm.jsx'));

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Destructure the new clearAuthError function
  const { signup, error: authError, isAuthenticated, clearAuthError } = useAuthContext();

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

  const handleSignup = async (credentials) => {
    // 4. Implement the try...finally block
    setIsSubmitting(true);
    clearAuthError();
    try {
      const success = await signup(credentials);
      if (success) {
        navigate('/verify-email', { 
          replace: true,
          state: { userEmail: credentials.userEmail } 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground" aria-busy="true" aria-live="polite">
        <LoadingSpinner size="large" label="Redirecting..." />
        <p className="mt-4">Redirecting...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | CareerForge</title>
        <meta name="description" content="Create your CareerForge account to build professional resumes with AI, generate cover letters, and prepare for interviews." />
        <meta property="og:title" content="Sign Up | CareerForge" />
        <meta property="og:description" content="Join CareerForge and take the next step in your career with our AI-powered tools." />
      </Helmet>

      <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8 overflow-hidden" aria-label="Signup Page Main Content">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-16 right-16 w-36 h-36 bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 rounded-full blur-2xl"
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-16 left-16 w-28 h-28 bg-gradient-to-tr from-primary/10 to-success/10 rounded-full blur-2xl"
            animate={{
              y: [0, 25, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-success/10 to-accent-pink/10 rounded-full blur-xl"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 12,
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
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Create Your Account</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Join us and start building your future today.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 pt-0">
              <Suspense fallback={
                <div className="flex justify-center items-center h-60">
                  <LoadingSpinner label="Loading form..." />
                </div>
              }>
                <SignupForm
                  onSubmit={handleSignup}
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
            </CardContent>
            <CardFooter className="flex flex-col items-center p-6 sm:p-8 pt-2">
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                  Log In
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default SignupPage;