import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthContext from '../hooks/useAuth.js';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button'; // For potential future use

// Lazy load SignupForm
const SignupForm = React.lazy(() => import('../components/Auth/SignupForm.jsx'));

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isLoading, error: authError, isAuthenticated } = useAuthContext(); // Renamed error

  const [pageError, setPageError] = useState(null); // For page-level errors if any

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (authError) {
      setPageError(authError.message || 'An authentication error occurred during signup.');
    } else {
      setPageError(null);
    }
  }, [authError]);

  const handleSignup = async (credentials) => {
    setPageError(null);
    const success = await signup(credentials);
    if (success) {
      navigate(from, { replace: true });
    }
    // If signup fails, authError in context will be updated.
    // SignupForm also receives authError directly via apiError prop.
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
        {/* Add other relevant OG/Twitter tags */}
      </Helmet>

      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8" aria-label="Signup Page Main Content">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="bg-card text-card-foreground shadow-2xl rounded-xl">
            <CardHeader className="text-center p-6 sm:p-8">
               <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                className="mx-auto mb-4 text-primary"
              >
                 <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-brand via-brand-light to-brand-dark text-transparent bg-clip-text">
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
                <div className="flex justify-center items-center h-60"> {/* Adjusted height for signup form */}
                  <LoadingSpinner label="Loading form..." />
                </div>
              }>
                <SignupForm
                  onSubmit={handleSignup}
                  isLoading={isLoading}
                  apiError={authError} // Pass the error object from context
                />
              </Suspense>
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
